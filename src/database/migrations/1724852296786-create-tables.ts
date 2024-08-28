import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1724852296786 implements MigrationInterface {
    name = 'CreateTables1724852296786'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "measures" ("measure_uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "custumer_code" character varying NOT NULL, "measure_datetime" TIMESTAMP NOT NULL, "measure_type" character varying NOT NULL, "has_confirmed" boolean NOT NULL, "image-url" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_b93fb7af692ed8f786bba1d3328" PRIMARY KEY ("measure_uuid"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "measures"`);
    }

}
