import { Test, TestingModule } from '@nestjs/testing';
import { GetAllMeasureUseCase } from './get-all-measures.use-case';
import { InMemoryRepository } from '../../../modules/measure/repository/measure.inmemory.repository';

describe('Get all measures tests', () => {
  let getAllMeasureUseCase: GetAllMeasureUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllMeasureUseCase,
        InMemoryRepository,
        {
          provide: 'IMeasureRepository',
          useExisting: InMemoryRepository,
        },
      ],
    }).compile();

    getAllMeasureUseCase =
      module.get<GetAllMeasureUseCase>(GetAllMeasureUseCase);
  });

  test('Get all registered measures', async () => {
    const measures = await getAllMeasureUseCase.execute();
    expect(measures.length).toBeGreaterThan(0);
  });
});
