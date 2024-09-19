import { InjectRepository } from '@nestjs/typeorm';
import { MeasureEntity } from '../measure.entity';
import { IMeasureRepository } from './measure.interface.repository';
import { Repository } from 'typeorm';
import { EnumMeasureTypes } from 'src/enum/measureTypesEnum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MeasureTypeOrmRepository implements IMeasureRepository {
  constructor(
    @InjectRepository(MeasureEntity)
    private readonly measureRepository: Repository<MeasureEntity>,
  ) {}

  async createMeasure(measure: MeasureEntity): Promise<MeasureEntity> {
    return await this.measureRepository.save(measure);
  }

  async findMeasureByCustumerCode(
    custumer_code: string,
  ): Promise<MeasureEntity[]> {
    return await this.measureRepository.find({
      where: { custumer_code },
    });
  }

  async findMeasureByCustumerCodeAndType(
    custumer_code: string,
    measure_type: string,
  ): Promise<MeasureEntity[]> {
    return await this.measureRepository.find({
      where: { custumer_code, measure_type: EnumMeasureTypes[measure_type] },
    });
  }

  async findMeasureById(measure_uuid: string): Promise<MeasureEntity> {
    return await this.measureRepository.findOneBy({
      measure_uuid: measure_uuid,
    });
  }

  async updateMeasure(measure: MeasureEntity): Promise<void> {
    await this.measureRepository.save(measure);
  }
}
