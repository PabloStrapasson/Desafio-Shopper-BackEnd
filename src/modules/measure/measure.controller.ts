import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { MeasureService } from './measure.service';
import { CreateMeasureDto } from './dto/create-measure.dto';
import { EnumMeasureTypes } from '../../enum/measureTypesEnum';
import { UploadMeasureDto } from './dto/upload-measure.dto';
import { CreateDatePipe } from 'src/resource/pipes/createDate.pipe';

@Controller()
export class MeasureController {
  constructor(private readonly measureService: MeasureService) {}

  @Post('create')
  async create(@Body() createMeasureDto: CreateMeasureDto) {
    const newMeasure =
      await this.measureService.createMeasure(createMeasureDto);

    return {
      data: newMeasure,
      message: 'Medição cadastrada com sucesso',
    };
  }

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

  @Get('list')
  async findAll() {
    const allMeasures = await this.measureService.findAllMeasures();

    return {
      data: allMeasures,
      message: 'Medições encontrados com sucesso!',
    };
  }

  @Get(':custumer_code/list') // CONCLUÍDO - verificar melhorias
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

  @Delete('/delete/:id')
  remove(@Param('id') id: string) {
    return this.measureService.remove(id);
  }
}
