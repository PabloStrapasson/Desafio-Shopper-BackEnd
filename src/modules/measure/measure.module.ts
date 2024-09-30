import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeasureEntity } from './measure.entity';
import { MeasureController } from './measure.controller';
import { MeasureTypeOrmRepository } from './repository/measure.typeorm.repository';
import { UploadImageMeasureUseCase } from '../use-cases/upload-image-measure/upload-image-measure.use-case';
import { ConfirmMeasureUseCase } from '../use-cases/confirm-measure/confirm-measure.use-case';
import { GetMeasuresByCustumerCodeUseCase } from '../use-cases/get-measures-by-custumer/get-measures-by-custumer.use-case';
import { GetAllMeasureUseCase } from '../use-cases/get-all-measures/get-all-measures.use-case';
import { DeleteMeasureUseCase } from '../use-cases/delete-measure/delete-measure.use-case';
import { GetTemporaryLinkUseCase } from '../use-cases/get-temporary-link/get-temporary-link.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([MeasureEntity])],
  controllers: [MeasureController],
  providers: [
    UploadImageMeasureUseCase,
    ConfirmMeasureUseCase,
    GetMeasuresByCustumerCodeUseCase,
    GetAllMeasureUseCase,
    DeleteMeasureUseCase,
    GetTemporaryLinkUseCase,
    MeasureTypeOrmRepository,
    {
      provide: 'IMeasureRepository',
      useExisting: MeasureTypeOrmRepository,
    },
  ],
})
export class MeasureModule {}
