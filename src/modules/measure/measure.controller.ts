import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
  Inject,
  Delete,
} from '@nestjs/common';
import { UploadMeasureDto } from './dto/upload-measure.dto';
import { ConfirmMeasureDto } from './dto/confirm-measure.dto';
import { CreateDatePipe } from '../../resource/pipes/createDate.pipe';
import { UploadImageMeasureUseCase } from '../use-cases/upload-image-measure/upload-image-measure.use-case';
import { ConfirmMeasureUseCase } from '../use-cases/confirm-measure/confirm-measure.use-case';
import { GetMeasuresByCustumerCodeUseCase } from '../use-cases/get-measures-by-custumer/get-measures-by-custumer.use-case';
import { GetAllMeasureUseCase } from '../use-cases/get-all-measures/get-all-measures.use-case';
import { DeleteMeasureUseCase } from '../use-cases/delete-measure/delete-measure.use-case';
import { GetTemporaryLinkUseCase } from '../use-cases/get-temporary-link/get-temporary-link.use-case';

@Controller()
export class MeasureController {
  @Inject(UploadImageMeasureUseCase)
  private readonly uploadMeasureUseCase: UploadImageMeasureUseCase;

  @Inject(ConfirmMeasureUseCase)
  private readonly confirmMeasureUseCase: ConfirmMeasureUseCase;

  @Inject(GetMeasuresByCustumerCodeUseCase)
  private readonly getMeasuresByCustumerUseCase: GetMeasuresByCustumerCodeUseCase;

  @Inject(GetAllMeasureUseCase)
  private readonly getAllMeasureUseCase: GetAllMeasureUseCase;

  @Inject(DeleteMeasureUseCase)
  private readonly deleteMeasureUseCase: DeleteMeasureUseCase;

  @Inject(GetTemporaryLinkUseCase)
  private readonly getTemporaryLinkUseCase: GetTemporaryLinkUseCase;

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

  @Get('list')
  async getAllMeasure() {
    return await this.getAllMeasureUseCase.execute();
  }

  @Delete('delete/:id')
  async deleteMeasure(@Param('id') measure_uuid: string) {
    await this.deleteMeasureUseCase.execute(measure_uuid);
  }

  @Get('image/:id')
  findOne(@Param('id') link_uuid: string) {
    const imageLink = this.getTemporaryLinkUseCase.execute(link_uuid);
    return imageLink;
  }
}
