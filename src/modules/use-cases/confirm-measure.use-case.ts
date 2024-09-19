import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { IMeasureRepository } from '../measure/repository/measure.interface.repository';
import { ConfirmMeasureDto } from '../measure/dto/confirm-measure.dto';

@Injectable()
export class ConfirmMeasureUseCase {
  @Inject('IMeasureRepository')
  private readonly measureRepository: IMeasureRepository;

  async execute(confirmMeasureDto: ConfirmMeasureDto) {
    const measure = await this.measureRepository.findMeasureById(
      confirmMeasureDto.measure_uuid,
    );

    if (measure.has_confirmed) {
      throw new ConflictException({
        error_code: 'CONFIRMATION_DUPLICATE',
        error_description: 'Leitura do mês já realizada',
      });
    }

    measure.measure_value = confirmMeasureDto.confirmed_value;
    measure.has_confirmed = true;
    await this.measureRepository.updateMeasure(measure);

    return true;
  }
}
