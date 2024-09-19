import { Inject, Injectable } from '@nestjs/common';
import { IMeasureRepository } from '../measure/repository/measure.interface.repository';

@Injectable()
export class GetAllMeasureUseCase {
  @Inject('IMeasureRepository')
  private readonly measureRepository: IMeasureRepository;

  async execute() {
    return await this.measureRepository.findAllMeasure();
  }
}
