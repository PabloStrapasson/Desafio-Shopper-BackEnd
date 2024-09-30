import { Test, TestingModule } from '@nestjs/testing';
import { ConfirmMeasureUseCase } from './confirm-measure.use-case';
import { InMemoryRepository } from '../../../modules/measure/repository/measure.inmemory.repository';
import { ConfirmMeasureDto } from 'src/modules/measure/dto/confirm-measure.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('Confirm measure tests', () => {
  let confirmMeasureUseCase: ConfirmMeasureUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfirmMeasureUseCase,
        InMemoryRepository,
        {
          provide: 'IMeasureRepository',
          useExisting: InMemoryRepository,
        },
      ],
    }).compile();

    confirmMeasureUseCase = module.get<ConfirmMeasureUseCase>(
      ConfirmMeasureUseCase,
    );
  });

  test('Confirm measure', async () => {
    const confirmMeasureDto: ConfirmMeasureDto = {
      measure_uuid: 'fa1e4ce5-8aa9-4acd-8ad6-a3ade909cea5',
      confirmed_value: 308.591,
    };

    expect(await confirmMeasureUseCase.execute(confirmMeasureDto)).toBeTruthy;
  });

  test('Duplicated confirmation for a measure', async () => {
    const confirmMeasureDto: ConfirmMeasureDto = {
      measure_uuid: 'fa1e4ce5-8aa9-4acd-8ad6-a3ade909cea5',
      confirmed_value: 308.591,
    };

    await confirmMeasureUseCase.execute(confirmMeasureDto);

    await expect(
      confirmMeasureUseCase.execute(confirmMeasureDto),
    ).rejects.toThrow(ConflictException);
  });

  test('Measure not found to confirm', async () => {
    const confirmMeasureDto: ConfirmMeasureDto = {
      measure_uuid: 'fa1e4ce5-8aa9-4acd-8ad6-a3ade909cec4',
      confirmed_value: 308.591,
    };

    await expect(
      confirmMeasureUseCase.execute(confirmMeasureDto),
    ).rejects.toThrow(NotFoundException);
  });
});
