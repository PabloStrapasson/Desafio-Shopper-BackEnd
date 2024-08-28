import { Module } from '@nestjs/common';
import { MeasureEntity } from './measure.entity';
import { MeasureService } from './measure.service';
import { MeasureController } from './measure.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MeasureEntity])],
  controllers: [MeasureController],
  providers: [MeasureService],
})
export class MeasureModule {}
