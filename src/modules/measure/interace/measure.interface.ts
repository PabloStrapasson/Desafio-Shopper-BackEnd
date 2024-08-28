import { CreateMeasureDto } from '../dto/create-measure.dto';

export abstract class MeasureServiceInterface {
  abstract createMeasure(createMeasureDto: CreateMeasureDto);
  abstract findAllMeasures();
  abstract findMeasuresByCustumerId(custumer_code: string);
  abstract findMeasuresByCustumerId(custumer_code: string, measureType: string);
  abstract remove(id: string);
}

// Não usada!!
