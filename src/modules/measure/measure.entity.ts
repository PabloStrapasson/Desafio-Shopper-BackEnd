import { EnumMeasureTypes } from '../../enum/measureTypesEnum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'measures' })
export class MeasureEntity {
  @PrimaryColumn()
  measure_uuid: string;

  @Column({ name: 'custumer_code', nullable: false })
  custumer_code: string;

  @Column({ name: 'measure_datetime', nullable: false })
  measure_datetime: Date;

  @Column({ name: 'measure_type', nullable: false })
  measure_type: EnumMeasureTypes;

  @Column('decimal', { name: 'measure_value', scale: 3, nullable: false })
  measure_value: number;

  @Column({ name: 'has_confirmed', nullable: false })
  has_confirmed: boolean;

  @Column({ name: 'image-url' })
  image_url: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: string;

  constructor(
    id: string,
    custumer_code: string,
    datetime: Date,
    type: EnumMeasureTypes,
    value: number,
    image_url: string,
  ) {
    this.measure_uuid = id;
    this.custumer_code = custumer_code;
    this.measure_datetime = datetime;
    this.measure_type = type;
    this.measure_value = value;
    this.has_confirmed = false;
    this.image_url = image_url;
  }
}
