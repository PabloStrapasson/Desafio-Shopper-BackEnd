import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTable1725061081824 implements MigrationInterface {
    name = 'CreateTable1725061081824'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "measures" ("measure_uuid" character varying NOT NULL, "custumer_code" character varying NOT NULL, "measure_datetime" TIMESTAMP NOT NULL, "measure_type" character varying NOT NULL, "measure_value" numeric NOT NULL, "has_confirmed" boolean NOT NULL, "image-url" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_b93fb7af692ed8f786bba1d3328" PRIMARY KEY ("measure_uuid"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "measures"`);
    }

}
