import {
  IsBase64,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { EnumMeasureTypes } from '../../../enum/measureTypesEnum';

export class UploadMeasureDto {
  @IsNotEmpty()
  @IsBase64()
  image: string;

  @IsNotEmpty()
  @IsString()
  custumer_code: string;

  @IsNotEmpty()
  @IsDateString()
  measure_datetime: Date;

  @IsNotEmpty()
  @IsEnum(EnumMeasureTypes)
  measure_type: EnumMeasureTypes;
}
