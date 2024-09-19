import { Inject, Injectable } from '@nestjs/common';
import { IMeasureRepository } from '../measure/repository/measure.interface.repository';

@Injectable()
export class DeleteMeasureUseCase {
  @Inject('IMeasureRepository')
  private readonly measureRepository: IMeasureRepository;

  async execute(measure_uuid: string) {
    await this.measureRepository.deleteMeasure(measure_uuid);
  }
}
