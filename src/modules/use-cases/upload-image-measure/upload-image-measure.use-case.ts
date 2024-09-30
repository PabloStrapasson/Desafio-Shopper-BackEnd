import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { IMeasureRepository } from '../../measure/repository/measure.interface.repository';
import { UploadMeasureDto } from '../../measure/dto/upload-measure.dto';
import { MeasureEntity } from '../../measure/measure.entity';
import { EnumMeasureTypes } from '../../../enum/measureTypesEnum';
import uuidGenerator from '../../../resource/utils/uuidGenerator';
import getGeminiModel from '../../../config/gemini.config';
import getBase64ImageType from '../../../resource/utils/getbase64ImageType';
import generateImageURL from '../../../resource/utils/generateImageURL';

@Injectable()
export class UploadImageMeasureUseCase {
  @Inject('IMeasureRepository')
  private readonly measureRepository: IMeasureRepository;

  async execute(UploadMeasureDto: UploadMeasureDto) {
    const hasMeasuresInSameMonth = await this.hasMeasuresInSameMonth(
      UploadMeasureDto.custumer_code,
      UploadMeasureDto.measure_type,
      UploadMeasureDto.measure_datetime,
    );
    if (hasMeasuresInSameMonth) {
      throw new ConflictException({
        error_code: 'DOUBLE_REPORT',
        error_description: 'Leitura do mês já realizada',
      });
    }

    const geminiResponse = await this.geminiMeasureIdentification(
      UploadMeasureDto.image,
    );

    const measure = new MeasureEntity(
      uuidGenerator(),
      UploadMeasureDto.custumer_code,
      UploadMeasureDto.measure_datetime,
      UploadMeasureDto.measure_type,
      geminiResponse,
      this.tempLinkGenerator(UploadMeasureDto.image),
    );

    const newMeasure = await this.measureRepository.createMeasure(measure);

    return {
      image_url: newMeasure.image_url,
      measure_value: newMeasure.measure_value,
      measure_uuid: newMeasure.measure_uuid,
    };
  }

  async hasMeasuresInSameMonth(
    custumer_code: string,
    measure_type: string,
    measure_datetime: Date,
  ) {
    const registeredMeasures =
      await this.measureRepository.findMeasureByCustumerCodeAndType(
        custumer_code,
        EnumMeasureTypes[measure_type],
      );

    const monthMeasures = registeredMeasures.filter(
      (measure) =>
        measure.measure_datetime.getMonth() === measure_datetime.getMonth() &&
        measure.measure_datetime.getFullYear() ===
          measure_datetime.getFullYear(),
    );

    return monthMeasures.length > 0;
  }

  async geminiMeasureIdentification(image: string) {
    const geminiModel = getGeminiModel();
    const prompt =
      'return the consumption value based on this image in base64, red digits are decimals, only float numbers';
    const mimeTypeImage = getBase64ImageType(image[0]);

    const geminiObjectResponse = await geminiModel.generateContent([
      prompt,
      { inlineData: { data: image, mimeType: mimeTypeImage } },
    ]);

    const geminiMeasureResponse =
      geminiObjectResponse.response.candidates[0].content.parts[0].text;

    if (Number.isNaN(Number(geminiMeasureResponse))) {
      throw new BadRequestException({
        error_description: 'Não foi possível identificar a leitura de consumo',
      });
    }

    return Number(geminiMeasureResponse);
  }

  private tempLinkGenerator(image: string) {
    const tempId = uuidGenerator();
    this.measureRepository.addTempLink(tempId, {
      path: generateImageURL(image),
      expiration_time: Date.now() + 3600000,
    });

    const tempImageLink = `http://localhost:3000/image/${tempId}`;

    return tempImageLink;
  }
}
