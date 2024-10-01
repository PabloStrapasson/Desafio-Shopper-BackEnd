import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DeleteMeasureUseCase } from './delete-measure.use-case';
import { InMemoryRepository } from '../../../modules/measure/repository/measure.inmemory.repository';

describe('Delete measure tests', () => {
  let deleteMeasureUseCase: DeleteMeasureUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteMeasureUseCase,
        InMemoryRepository,
        {
          provide: 'IMeasureRepository',
          useExisting: InMemoryRepository,
        },
      ],
    }).compile();

    deleteMeasureUseCase =
      module.get<DeleteMeasureUseCase>(DeleteMeasureUseCase);
  });

  test('Delete a measure', async () => {
    expect(
      await deleteMeasureUseCase.execute(
        'fa1e4ce5-8aa9-4acd-8ad6-a3ade909cea5',
      ),
    ).toBe(true);
  });

  test('Failure to delete a measure', async () => {
    await expect(
      deleteMeasureUseCase.execute('fa1e4ce5-8aa9-4acd-8ad6-a3ade909cec4'),
    ).rejects.toThrow(NotFoundException);
  });
});
