import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMeasureDto } from './dto/create-measure.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MeasureEntity } from './measure.entity';
import { Repository } from 'typeorm';
import { ListMeasureDto } from './dto/list-measure.dto';
import { EnumMeasureTypes } from 'src/enum/measureTypesEnum';
import { UploadMeasureDto } from './dto/upload-measure.dto';
import getGeminiModel from '../../config/gemini.config';

@Injectable()
export class MeasureService {
  constructor(
    @InjectRepository(MeasureEntity)
    private readonly measureRepository: Repository<MeasureEntity>,
  ) {}

  async createMeasure(createMeasureDto: CreateMeasureDto) {
    const measure = new MeasureEntity();
    Object.assign(measure, createMeasureDto as MeasureEntity);
    const newMeasure = await this.measureRepository.save(measure);

    const measureDto = new ListMeasureDto(
      newMeasure.measure_uuid,
      newMeasure.measure_datetime,
      newMeasure.measure_type,
      newMeasure.has_confirmed,
      newMeasure.image_url,
    );

    return measureDto;
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

  getBase64ImageType(firstCaracter: string) {
    /* '/' = jpg, 'i' = png, 'R' = gif, 'U' = webp */
    if (firstCaracter === '/') {
      return 'image/jpg';
    }
    if (firstCaracter === 'i') {
      return 'image/png';
    }
  }

  generateImageURL(image: string) {
    const imageMimeType = this.getBase64ImageType(image[0]);
    const baseUrl = `data:${imageMimeType};base64,`;
    const imageURL = baseUrl + image;

    return imageURL;
  }

  async geminiMeasureIdentification(image: string) {
    const geminiModel = getGeminiModel();
    const prompt =
      'return the consumption value based on this image in base64, red digits are decimals, only float numbers';
    const mimeTypeImage = this.getBase64ImageType(image[0]);

    const geminiObjectResponse = await geminiModel.generateContent([
      prompt,
      { inlineData: { data: image, mimeType: mimeTypeImage } },
    ]);

    const geminiMeasureResponse =
      geminiObjectResponse.response.candidates[0].content.parts[0].text;

    return Number(geminiMeasureResponse);
  }

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
    measure.custumer_code = custumer_code;
    measure.measure_datetime = measure_datetime;
    measure.measure_type = measure_type;
    measure.has_confirmed = false;
    measure.image_url = this.generateImageURL(image);

    const newMeasure = await this.measureRepository.save(measure);

    return {
      image_url: newMeasure.image_url,
      measure_value: geminiResponse,
      measure_uuid: newMeasure.measure_uuid,
    };
  }

  async findAllMeasures() {
    const measures = await this.measureRepository.find();
    const measuresList = this.createListMeasuresDto(measures);

    return measuresList;
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

  async remove(id: string) {
    const result = await this.measureRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException('Measure não encontrada!');
    }
  }

  createListMeasuresDto(measures: MeasureEntity[]) {
    const measuresList = measures.map((measure) => {
      return new ListMeasureDto(
        measure.measure_uuid,
        measure.measure_datetime,
        measure.measure_type,
        measure.has_confirmed,
        measure.image_url,
      );
    });

    return measuresList;
  }
}
