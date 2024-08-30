import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateMeasureTable1724972740775 implements MigrationInterface {
  name = 'UpdateMeasureTable1724972740775';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "measures" ADD "measure_value" numeric NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "measures" DROP COLUMN "measure_value"`,
    );
  }
}
