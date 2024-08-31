import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MeasureEntity } from './measure.entity';
import { ListMeasureDto } from './dto/list-measure.dto';
import { ConfirmMeasureDto } from './dto/confirm-measure.dto';
import { EnumMeasureTypes } from '../../enum/measureTypesEnum';
import { UploadMeasureDto } from './dto/upload-measure.dto';
import getGeminiModel from '../../config/gemini.config';
import uuidGenerator from '../../resource/utils/uuidGenerator';
import generateImageURL from '../../resource/utils/generateImageURL';
import getBase64ImageType from '../../resource/utils/getbase64ImageType';

@Injectable()
export class MeasureService {
  TempLinks = {};

  constructor(
    @InjectRepository(MeasureEntity)
    private readonly measureRepository: Repository<MeasureEntity>,
  ) {}

  async uploadMeasure({
    image,
    custumer_code,
    measure_datetime,
    measure_type,
  }: UploadMeasureDto) {
    const hasMeasuresInSameMonth = await this.hasMeasuresInSameMonth(
      custumer_code,
      measure_type,
      measure_datetime,
    );
    if (hasMeasuresInSameMonth) {
      throw new ConflictException({
        error_code: 'DOUBLE_REPORT',
        error_description: 'Leitura do mês já realizada',
      });
    }

    const geminiResponse = await this.geminiMeasureIdentification(image);

    const measure = new MeasureEntity();
    measure.measure_uuid = uuidGenerator();
    measure.custumer_code = custumer_code;
    measure.measure_datetime = measure_datetime;
    measure.measure_type = measure_type;
    measure.measure_value = geminiResponse;
    measure.has_confirmed = false;
    measure.image_url = this.tempLinkGenerator(image);

    const newMeasure = await this.measureRepository.save(measure);

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
    const registeredMeasures = await this.measureRepository.find({
      where: {
        custumer_code: custumer_code,
        measure_type: EnumMeasureTypes[measure_type],
      },
    });

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

    return Number(geminiMeasureResponse);
  }

  async confirmMeasure(confirmMeasureDto: ConfirmMeasureDto) {
    const measure = await this.getMeasureById(confirmMeasureDto.measure_uuid);

    const measureIsConfirmed = measure.has_confirmed;
    if (measureIsConfirmed) {
      throw new ConflictException({
        error_code: 'CONFIRMATION_DUPLICATE',
        error_description: 'Leitura do mês já realizada',
      });
    }

    measure.measure_value = confirmMeasureDto.confirmed_value;
    measure.has_confirmed = true;
    await this.measureRepository.save(measure);

    return true;
  }

  async getMeasureById(measure_uuid: string) {
    const measure = await this.measureRepository.findOneBy({
      measure_uuid: measure_uuid,
    });

    if (!measure) {
      throw new NotFoundException({
        error_code: 'MEASURE_NOT_FOUND',
        error_description: 'Leitura não encontrada',
      });
    }

    return measure;
  }

  async findMeasuresByCustumerCode(custumer_code: string) {
    const measures = await this.measureRepository.find({
      where: { custumer_code },
    });

    if (measures.length === 0) {
      throw new NotFoundException({
        error_code: 'MEASURES_NOT_FOUND',
        error_description: 'Nenhuma leitura encontrada',
      });
    }
    const measuresList = this.createListMeasuresDto(measures);

    return measuresList;
  }

  async findMeasuresByCustumerCodeAndType(
    custumer_code: string,
    measure_type: string,
  ) {
    const measures = await this.measureRepository.find({
      where: { custumer_code, measure_type: EnumMeasureTypes[measure_type] },
    });

    if (measures.length === 0) {
      throw new NotFoundException({
        error_code: 'MEASURES_NOT_FOUND',
        error_description: 'Nenhuma leitura encontrada',
      });
    }

    const measuresList = this.createListMeasuresDto(measures);

    return measuresList;
  }

  private createListMeasuresDto(measures: MeasureEntity[]) {
    const measuresList = measures.map((measure) => {
      return new ListMeasureDto(
        measure.measure_uuid,
        measure.measure_datetime,
        measure.measure_type,
        measure.measure_value,
        measure.has_confirmed,
        measure.image_url,
      );
    });

    return measuresList;
  }

  private tempLinkGenerator(image: string) {
    const tempId = uuidGenerator();
    this.TempLinks[tempId] = {
      path: generateImageURL(image),
      expiration_time: Date.now() + 3600000,
    };

    const tempImageLink = `http://localhost:3000/image/${tempId}`;

    return tempImageLink;
  }

  getImageLink(id: string) {
    const imageLink = this.TempLinks[`${id}`];

    if (imageLink === undefined) {
      throw new NotFoundException({
        error_code: 'INVALID_LINK',
        error_description: 'Link não encontrado ou expirado',
      });
    }

    if (imageLink.expiration_time < Date.now()) {
      delete this.TempLinks[`${id}`];
      throw new NotFoundException({
        error_code: 'INVALID_LINK',
        error_description: 'Link não encontrado ou expirado',
      });
    }

    return imageLink.path;
  }
}
