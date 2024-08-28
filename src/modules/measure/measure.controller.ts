import {
  Controller,
  Get,
  Post,
  Body,
  //Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { MeasureService } from './measure.service';
import { CreateMeasureDto } from './dto/create-measure.dto';
//import { UpdateMeasureDto } from './dto/update-measure.dto';
import { CreateDatePipe } from '../../resource/pipes/createDate.pipe';
import { EnumMeasureTypes } from '../../enum/measureTypesEnum';

@Controller()
export class MeasureController {
  constructor(private readonly measureService: MeasureService) {}

  @Post('upload')
  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() { measure_datetime, ...createMeasureDto }: CreateMeasureDto,
    @Body('measure_datetime', CreateDatePipe) measureDate: Date,
  ) {
    const newMeasure = await this.measureService.createMeasure({
      ...createMeasureDto,
      measure_datetime: measureDate,
    });

    return {
      data: newMeasure,
      message: 'Medição cadastrada com sucesso',
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

  @Get(':custumer_code/list')
  async findAllByCustumerCode(
    @Param('custumer_code') custumer_code: string,
    @Query('measure_type') measure_type: string,
  ) {
    if (measure_type != null) {
      measure_type = measure_type.toLowerCase();

      if (EnumMeasureTypes[measure_type] === undefined) {
        throw new BadRequestException({
          error_code: 'INVALID_DATA',
          error_description: 'Tipo de medição não permitida',
        });
      }

      const allMeasures =
        await this.measureService.findMeasuresByCustumerIdType(
          custumer_code,
          measure_type,
        );

      return {
        custumer_code: custumer_code,
        measures: allMeasures,
      };
    }

    const allMeasures =
      await this.measureService.findMeasuresByCustumerId(custumer_code);

    return {
      custumer_code: custumer_code,
      measures: allMeasures,
    };
  }

  /*
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.measureService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMeasureDto: UpdateMeasureDto) {
    return this.measureService.update(+id, updateMeasureDto);
  }
  */

  @Delete('/delete/:id')
  remove(@Param('id') id: string) {
    return this.measureService.remove(id);
  }
}
