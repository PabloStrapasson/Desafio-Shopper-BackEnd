import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MeasureEntity } from '../measure.entity';
import { IMeasureRepository } from './measure.interface.repository';
import { EnumMeasureTypes } from '../../../enum/measureTypesEnum';

@Injectable()
export class MeasureTypeOrmRepository implements IMeasureRepository {
  private TempLinks = {};

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

  async findAllMeasure(): Promise<MeasureEntity[]> {
    return await this.measureRepository.find();
  }

  async deleteMeasure(measure_uuid: string) {
    await this.measureRepository.delete(measure_uuid);
  }

  // Métodos para recuperar links temporários
  findTempLinkById(link_uuid: string) {
    return this.TempLinks[link_uuid];
  }

  addTempLink(link_uuid: string, link: any) {
    this.TempLinks[link_uuid] = link;
  }

  removeTempLink(link_uuid: string) {
    delete this.TempLinks[`${link_uuid}`];
  }
}
