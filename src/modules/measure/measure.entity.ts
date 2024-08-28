import { EnumMeasureTypes } from '../../enum/measureTypesEnum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  //PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'measures' })
export class MeasureEntity {
  @PrimaryGeneratedColumn('uuid')
  measure_uuid: string;

  @Column({ name: 'custumer_code', nullable: false })
  custumer_code: string;

  @Column({ name: 'measure_datetime', nullable: false })
  measure_datetime: Date;

  @Column({ name: 'measure_type', nullable: false })
  measure_type: EnumMeasureTypes;

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
}
