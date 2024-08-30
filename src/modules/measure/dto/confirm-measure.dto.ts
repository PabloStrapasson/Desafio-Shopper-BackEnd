import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class ConfirmMeasureDto {
  @IsNotEmpty()
  @IsUUID()
  measure_uuid: string;

  @IsNumber()
  confirmed_value: number;
}
