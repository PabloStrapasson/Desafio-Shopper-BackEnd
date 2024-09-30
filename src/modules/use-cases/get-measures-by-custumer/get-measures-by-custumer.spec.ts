import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { GetMeasuresByCustumerCodeUseCase } from './get-measures-by-custumer.use-case';
import { InMemoryRepository } from '../../../modules/measure/repository/measure.inmemory.repository';

describe('Get measures by custumer tests', () => {
  let getMeasuresByCustumerUseCase: GetMeasuresByCustumerCodeUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetMeasuresByCustumerCodeUseCase,
        InMemoryRepository,
        {
          provide: 'IMeasureRepository',
          useExisting: InMemoryRepository,
        },
      ],
    }).compile();

    getMeasuresByCustumerUseCase = module.get<GetMeasuresByCustumerCodeUseCase>(
      GetMeasuresByCustumerCodeUseCase,
    );
  });

  test('Get measure by custumer_code', async () => {
    const measures = await getMeasuresByCustumerUseCase.execute('12345');

    expect(measures).toHaveProperty('custumer_code');
    expect(measures).toHaveProperty('measures');
  });

  test('Failure in get measure by custumer_code', async () => {
    await expect(getMeasuresByCustumerUseCase.execute('54321')).rejects.toThrow(
      NotFoundException,
    );
  });

  test('Get measure by custumer_code + measure_type', async () => {
    const measures = await getMeasuresByCustumerUseCase.execute('12345', 'gas');

    expect(measures).toHaveProperty('custumer_code');
    expect(measures).toHaveProperty('measures');
  });

  test('Failure in get measure by custumer_code + measure_type', async () => {
    await expect(
      getMeasuresByCustumerUseCase.execute('12345', 'water'),
    ).rejects.toThrow(NotFoundException);
  });

  test('Failure in get measure by custumer_code + measure_type, not found custumer_code', async () => {
    await expect(
      getMeasuresByCustumerUseCase.execute('54321', 'water'),
    ).rejects.toThrow(NotFoundException);
  });

  test('Invalid measure_type', async () => {
    await expect(
      getMeasuresByCustumerUseCase.execute('12345', 'água'),
    ).rejects.toThrow(BadRequestException);
  });
});
