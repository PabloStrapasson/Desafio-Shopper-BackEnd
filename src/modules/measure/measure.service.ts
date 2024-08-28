import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMeasureDto } from './dto/create-measure.dto';
//import { UpdateMeasureDto } from './dto/update-measure.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MeasureEntity } from './measure.entity';
import { Repository } from 'typeorm';
import { ListMeasureDto } from './dto/list-measure.dto';
import { EnumMeasureTypes } from 'src/enum/measureTypesEnum';

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

  async findAllMeasures() {
    const measures = await this.measureRepository.find();
    const measuresList = this.createListMeasuresDto(measures);

    return measuresList;
  }

  async findMeasuresByCustumerId(custumer_code: string) {
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

  async findMeasuresByCustumerIdType(
    custumer_code: string,
    measureType: string,
  ) {
    const measure_type =
      EnumMeasureTypes[measureType as keyof typeof EnumMeasureTypes];

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
  /*
  findOne(id: number) {
    return `This action returns a #${id} measure`;
  }

  update(id: number, updateMeasureDto: UpdateMeasureDto) {
    return `This action updates a #${id} measure`;
  }

  remove(id: number) {
    const result = await this.employeeRepository.delete(id);
  }
  */
}
