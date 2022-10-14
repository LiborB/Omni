import { MigrationInterface, QueryRunner } from "typeorm";

export class mimetype1665732702215 implements MigrationInterface {
    name = 'mimetype1665732702215'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "song" ADD "mimeType" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "song" DROP COLUMN "mimeType"`);
    }

}
