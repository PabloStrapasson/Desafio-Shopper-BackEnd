import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IMeasureRepository } from '../../measure/repository/measure.interface.repository';

@Injectable()
export class DeleteMeasureUseCase {
  @Inject('IMeasureRepository')
  private readonly measureRepository: IMeasureRepository;

  async execute(measure_uuid: string) {
    const measure = await this.measureRepository.findMeasureById(measure_uuid);

    if (measure === undefined) {
      throw new NotFoundException({
        error_code: 'MEASURE_NOT_FOUND',
        error_description: 'Leitura não encontrada',
      });
    }
    await this.measureRepository.deleteMeasure(measure_uuid);

    return true;
  }
}
