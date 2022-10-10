import { MigrationInterface, QueryRunner } from "typeorm";

export class artistFields1664688981549 implements MigrationInterface {
    name = 'artistFields1664688981549'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "artist" ADD "userId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "artist" ADD CONSTRAINT "UQ_e9f92c29c3c017855447199e619" UNIQUE ("userId", "name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "artist" DROP CONSTRAINT "UQ_e9f92c29c3c017855447199e619"`);
        await queryRunner.query(`ALTER TABLE "artist" DROP COLUMN "userId"`);
    }

}
