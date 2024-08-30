import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  BadRequestException,
  Patch,
} from '@nestjs/common';
import { MeasureService } from './measure.service';
import { EnumMeasureTypes } from '../../enum/measureTypesEnum';
import { UploadMeasureDto } from './dto/upload-measure.dto';
import { ConfirmMeasureDto } from './dto/confirm-measure.dto';
import { CreateDatePipe } from 'src/resource/pipes/createDate.pipe';

@Controller()
export class MeasureController {
  constructor(private readonly measureService: MeasureService) {}

  @Post('upload')
  async uploadMeasure(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() { measure_datetime, ...uploadMeasureDto }: UploadMeasureDto,
    @Body('measure_datetime', CreateDatePipe) measureDate: Date,
  ) {
    const newMeasure = await this.measureService.uploadMeasure({
      ...uploadMeasureDto,
      measure_datetime: measureDate,
    });

    return newMeasure;
  }

  @Patch('confirm')
  async confirmMeasure(@Body() confirmMeasureDto: ConfirmMeasureDto) {
    await this.measureService.confirmMeasure(confirmMeasureDto);

    return { success: true };
  }

  @Get(':custumer_code/list')
  async getMeasuresByCustumerCode(
    @Param('custumer_code') custumer_code: string,
    @Query('measure_type') measure_type: string,
  ) {
    if (measure_type != null) {
      measure_type = measure_type.toUpperCase();

      if (EnumMeasureTypes[measure_type] === undefined) {
        throw new BadRequestException({
          error_code: 'INVALID_DATA',
          error_description: 'Tipo de medição não permitida',
        });
      }

      const allMeasures =
        await this.measureService.findMeasuresByCustumerCodeAndType(
          custumer_code,
          measure_type,
        );

      return {
        custumer_code: custumer_code,
        measures: allMeasures,
      };
    }

    const allMeasures =
      await this.measureService.findMeasuresByCustumerCode(custumer_code);

    return {
      custumer_code: custumer_code,
      measures: allMeasures,
    };
  }

  @Get('list')
  async findAll() {
    const allMeasures = await this.measureService.findAllMeasures();

    return {
      data: allMeasures,
      message: 'Medições encontrados com sucesso!',
    };
  }

  @Delete('/delete/:id')
  remove(@Param('id') id: string) {
    return this.measureService.remove(id);
  }
}
