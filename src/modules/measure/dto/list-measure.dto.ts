import { EnumMeasureTypes } from '../../../enum/measureTypesEnum';

export class ListMeasureDto {
  constructor(
    readonly measure_uuid: string,
    readonly measure_datetime: Date,
    readonly measure_type: EnumMeasureTypes,
    readonly has_confirmed: boolean,
    readonly image_url: string,
  ) {}
}
