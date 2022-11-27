import { MigrationInterface, QueryRunner } from "typeorm";

export class addSongKey1669590687982 implements MigrationInterface {
    name = 'addSongKey1669590687982'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "song" ADD "songKey" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "song" DROP COLUMN "songKey"`);
    }

}
