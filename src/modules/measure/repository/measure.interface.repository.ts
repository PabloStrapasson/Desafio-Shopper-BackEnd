import { MeasureEntity } from '../measure.entity';

export interface IMeasureRepository {
  createMeasure(measure: MeasureEntity): Promise<MeasureEntity>;

  findMeasureByCustumerCode(custumer_code: string): Promise<MeasureEntity[]>;

  findMeasureByCustumerCodeAndType(
    custumer_code: string,
    measure_type: string,
  ): Promise<MeasureEntity[]>;

  findMeasureById(measure_uuid: string): Promise<MeasureEntity>;

  updateMeasure(measure: MeasureEntity): Promise<void>;

  findAllMeasure(): Promise<MeasureEntity[]>;

  deleteMeasure(measure_uuid: string): Promise<void>;

  // Métodos para recuperar links temporários
  findTempLinkById(link_uuid: string);

  addTempLink(link_uuid: string, link: any);

  removeTempLink(link_uuid: string);
}
