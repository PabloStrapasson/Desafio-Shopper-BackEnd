import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsUrl } from 'class-validator';
import { EnumMeasureTypes } from '../../../enum/measureTypesEnum';

export class CreateMeasureDto {
  @IsNotEmpty()
  custumer_code: string;

  @IsNotEmpty()
  @IsDate()
  measure_datetime: Date;

  @IsNotEmpty()
  @IsEnum(EnumMeasureTypes)
  measure_type: EnumMeasureTypes;

  @IsNotEmpty()
  @IsBoolean()
  has_confirmed: boolean;

  @IsNotEmpty()
  @IsUrl()
  image_url: string;
}
