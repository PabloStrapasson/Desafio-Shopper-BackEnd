import { Injectable } from '@nestjs/common';
import { IMeasureRepository } from './measure.interface.repository';
import { MeasureEntity } from '../measure.entity';
import { EnumMeasureTypes } from '../../../enum/measureTypesEnum';

@Injectable()
export class InMemoryRepository implements IMeasureRepository {
  private Measures: MeasureEntity[] = [];
  private TempLinks = {};

  constructor() {
    const measure = new MeasureEntity(
      'fa1e4ce5-8aa9-4acd-8ad6-a3ade909cea5',
      '12345',
      new Date('2024-08-30'),
      EnumMeasureTypes['GAS'],
      3085.91,
      'http://localhost:3000/temp_link',
    );
    this.createMeasure(measure);
  }
  async createMeasure(measure: MeasureEntity): Promise<MeasureEntity> {
    this.Measures.push(measure);
    return measure;
  }

  async findMeasureByCustumerCode(
    custumer_code: string,
  ): Promise<MeasureEntity[]> {
    const measure = this.Measures.filter((measure) => {
      if (measure.custumer_code === custumer_code) {
        return measure;
      }
    });

    return measure;
  }

  async findMeasureByCustumerCodeAndType(
    custumer_code: string,
    measure_type: string,
  ): Promise<MeasureEntity[]> {
    const measure = this.Measures.filter((measure) => {
      if (
        measure.custumer_code === custumer_code &&
        measure.measure_type === measure_type
      ) {
        return measure;
      }
    });

    return measure;
  }

  async findMeasureById(measure_uuid: string): Promise<MeasureEntity> {
    const measure = this.Measures.filter((measure) => {
      if (measure.measure_uuid === measure_uuid) {
        return measure;
      }
    });

    return measure[0];
  }

  async updateMeasure(measure: MeasureEntity): Promise<void> {
    const index = this.Measures.findIndex((obj) => {
      if (obj.measure_uuid === measure.measure_uuid) return obj;
    });

    this.Measures[index] = measure;
  }

  async findAllMeasure(): Promise<MeasureEntity[]> {
    return this.Measures;
  }

  async deleteMeasure(measure_uuid: string): Promise<void> {
    const index = this.Measures.findIndex((measure) => {
      if (measure.measure_uuid === measure_uuid) return measure;
    });
    this.Measures.splice(index, 1);
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
