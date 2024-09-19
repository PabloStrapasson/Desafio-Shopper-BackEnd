import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
  Inject,
} from '@nestjs/common';
import { UploadMeasureDto } from './dto/upload-measure.dto';
import { ConfirmMeasureDto } from './dto/confirm-measure.dto';
import { CreateDatePipe } from 'src/resource/pipes/createDate.pipe';
import { UploadImageMeasureUseCase } from '../use-cases/upload-image-measure.use-case';
import { ConfirmMeasureUseCase } from '../use-cases/confirm-measure.use-case';
import { GetMeasuresByCustumerCodeUseCase } from '../use-cases/get-measures-by-custumer.use-case';

@Controller()
export class MeasureController {
  @Inject(UploadImageMeasureUseCase)
  private readonly uploadMeasureUseCase: UploadImageMeasureUseCase;

  @Inject(ConfirmMeasureUseCase)
  private readonly confirmMeasureUseCase: ConfirmMeasureUseCase;

  @Inject(GetMeasuresByCustumerCodeUseCase)
  private readonly getMeasuresByCustumerUseCase: GetMeasuresByCustumerCodeUseCase;

  @Post('upload')
  async uploadMeasure(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() { measure_datetime, ...uploadMeasureDto }: UploadMeasureDto,
    @Body('measure_datetime', CreateDatePipe) measureDate: Date,
  ) {
    const newMeasure = await this.uploadMeasureUseCase.execute({
      ...uploadMeasureDto,
      measure_datetime: measureDate,
    });

    return newMeasure;
  }

  @Patch('confirm')
  async confirmMeasure(@Body() confirmMeasureDto: ConfirmMeasureDto) {
    await this.confirmMeasureUseCase.execute(confirmMeasureDto);

    return { success: true };
  }

  @Get(':custumer_code/list')
  async getMeasuresByCustumerCode(
    @Param('custumer_code') custumer_code: string,
    @Query('measure_type') measure_type: string,
  ) {
    return await this.getMeasuresByCustumerUseCase.execute(
      custumer_code,
      measure_type,
    );
  }
}
