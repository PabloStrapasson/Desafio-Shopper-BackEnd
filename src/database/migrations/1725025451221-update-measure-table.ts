import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateMeasureTable1725025451221 implements MigrationInterface {
  name = 'UpdateMeasureTable1725025451221';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "measures" DROP CONSTRAINT "PK_b93fb7af692ed8f786bba1d3328"`,
    );
    await queryRunner.query(
      `ALTER TABLE "measures" DROP COLUMN "measure_uuid"`,
    );
    await queryRunner.query(
      `ALTER TABLE "measures" ADD "measure_uuid" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "measures" ADD CONSTRAINT "PK_b93fb7af692ed8f786bba1d3328" PRIMARY KEY ("measure_uuid")`,
    );
    await queryRunner.query(
      `ALTER TABLE "measures" ALTER COLUMN "measure_value" TYPE numeric`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "measures" ALTER COLUMN "measure_value" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "measures" DROP CONSTRAINT "PK_b93fb7af692ed8f786bba1d3328"`,
    );
    await queryRunner.query(
      `ALTER TABLE "measures" DROP COLUMN "measure_uuid"`,
    );
    await queryRunner.query(
      `ALTER TABLE "measures" ADD "measure_uuid" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "measures" ADD CONSTRAINT "PK_b93fb7af692ed8f786bba1d3328" PRIMARY KEY ("measure_uuid")`,
    );
  }
}
