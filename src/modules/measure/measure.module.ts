import { Module } from '@nestjs/common';
import { MeasureEntity } from './measure.entity';
import { MeasureController } from './measure.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeasureTypeOrmRepository } from './repository/measure.typeorm.repository';
import { UploadImageMeasureUseCase } from '../use-cases/upload-image-measure.use-case';
import { ConfirmMeasureUseCase } from '../use-cases/confirm-measure.use-case';
import { GetMeasuresByCustumerCodeUseCase } from '../use-cases/get-measures-by-custumer.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([MeasureEntity])],
  controllers: [MeasureController],
  providers: [
    UploadImageMeasureUseCase,
    ConfirmMeasureUseCase,
    GetMeasuresByCustumerCodeUseCase,
    MeasureTypeOrmRepository,
    {
      provide: 'IMeasureRepository',
      useExisting: MeasureTypeOrmRepository,
    },
  ],
})
export class MeasureModule {}
