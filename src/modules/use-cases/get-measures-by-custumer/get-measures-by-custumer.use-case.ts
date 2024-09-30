import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IMeasureRepository } from '../../measure/repository/measure.interface.repository';
import { ListMeasureDto } from '../../measure/dto/list-measure.dto';
import { MeasureEntity } from '../../measure/measure.entity';
import { EnumMeasureTypes } from '../../../enum/measureTypesEnum';

@Injectable()
export class GetMeasuresByCustumerCodeUseCase {
  @Inject('IMeasureRepository')
  private readonly measureRepository: IMeasureRepository;

  async execute(custumer_code: string, measure_type?: string) {
    if (measure_type != null) {
      measure_type = measure_type.toUpperCase();

      if (EnumMeasureTypes[measure_type] === undefined) {
        throw new BadRequestException({
          message: 'Tipo de medição não permitida',
        });
      }

      const allMeasures = await this.findMeasuresByCustumerCodeAndType(
        custumer_code,
        measure_type,
      );

      return {
        custumer_code: custumer_code,
        measures: allMeasures,
      };
    }

    const allMeasures = await this.findMeasuresByCustumerCode(custumer_code);

    return {
      custumer_code: custumer_code,
      measures: allMeasures,
    };
  }

  async findMeasuresByCustumerCode(custumer_code: string) {
    const measures =
      await this.measureRepository.findMeasureByCustumerCode(custumer_code);

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
    const measures =
      await this.measureRepository.findMeasureByCustumerCodeAndType(
        custumer_code,
        measure_type,
      );

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
}
