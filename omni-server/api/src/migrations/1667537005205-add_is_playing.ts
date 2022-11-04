import { MigrationInterface, QueryRunner } from "typeorm";

export class addIsPlaying1667537005205 implements MigrationInterface {
    name = 'addIsPlaying1667537005205'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "song_queue" ADD "isPlaying" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "song_queue" DROP COLUMN "isPlaying"`);
    }

}
