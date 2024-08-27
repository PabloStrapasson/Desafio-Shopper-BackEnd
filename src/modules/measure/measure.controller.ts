import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MeasureService } from './measure.service';
import { CreateMeasureDto } from './dto/create-measure.dto';
import { UpdateMeasureDto } from './dto/update-measure.dto';

@Controller('measure')
export class MeasureController {
  constructor(private readonly measureService: MeasureService) {}

  @Post()
  create(@Body() createMeasureDto: CreateMeasureDto) {
    return this.measureService.create(createMeasureDto);
  }

  @Get()
  findAll() {
    return this.measureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.measureService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMeasureDto: UpdateMeasureDto) {
    return this.measureService.update(+id, updateMeasureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.measureService.remove(+id);
  }
}
