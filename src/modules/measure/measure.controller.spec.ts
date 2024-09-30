import { Test, TestingModule } from '@nestjs/testing';
import { MeasureController } from './measure.controller';
import { UploadImageMeasureUseCase } from '../use-cases/upload-image-measure/upload-image-measure.use-case';
import { ConfirmMeasureUseCase } from '../use-cases/confirm-measure/confirm-measure.use-case';
import { GetMeasuresByCustumerCodeUseCase } from '../use-cases/get-measures-by-custumer/get-measures-by-custumer.use-case';
import { GetAllMeasureUseCase } from '../use-cases/get-all-measures/get-all-measures.use-case';
import { DeleteMeasureUseCase } from '../use-cases/delete-measure/delete-measure.use-case';
import { GetTemporaryLinkUseCase } from '../use-cases/get-temporary-link/get-temporary-link.use-case';
//import { MeasureTypeOrmRepository } from './repository/measure.typeorm.repository';
import { InMemoryRepository } from './repository/measure.inmemory.repository';

describe('MeasureController Test', () => {
  let controller: MeasureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeasureController],
      providers: [
        UploadImageMeasureUseCase,
        ConfirmMeasureUseCase,
        GetMeasuresByCustumerCodeUseCase,
        GetAllMeasureUseCase,
        DeleteMeasureUseCase,
        GetTemporaryLinkUseCase,
        InMemoryRepository,
        {
          provide: 'IMeasureRepository',
          useExisting: InMemoryRepository,
        },
      ],
    }).compile();

    controller = module.get<MeasureController>(MeasureController);
  });

  it('Measure controller should be defined', () => {
    expect(controller).toBeDefined();
  });
});
