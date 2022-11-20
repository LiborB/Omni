import { MigrationInterface, QueryRunner } from "typeorm";

export class thumbnail1668910443402 implements MigrationInterface {
    name = 'thumbnail1668910443402'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "song" ADD "thumbnailKey" character varying`);
        await queryRunner.query(`ALTER TABLE "song" DROP COLUMN "duration"`);
        await queryRunner.query(`ALTER TABLE "song" ADD "duration" numeric`);
        await queryRunner.query(`ALTER TABLE "song_queue" ADD CONSTRAINT "UQ_436d97f551305b8a72b9f56908c" UNIQUE ("id", "isPlaying")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "song_queue" DROP CONSTRAINT "UQ_436d97f551305b8a72b9f56908c"`);
        await queryRunner.query(`ALTER TABLE "song" DROP COLUMN "duration"`);
        await queryRunner.query(`ALTER TABLE "song" ADD "duration" integer`);
        await queryRunner.query(`ALTER TABLE "song" DROP COLUMN "thumbnailKey"`);
    }

}
