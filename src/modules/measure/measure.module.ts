import { Module } from '@nestjs/common';
import { MeasureService } from './measure.service';
import { MeasureController } from './measure.controller';

@Module({
  controllers: [MeasureController],
  providers: [MeasureService],
})
export class MeasureModule {}
