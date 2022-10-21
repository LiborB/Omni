import { MigrationInterface, QueryRunner } from "typeorm";

export class queueUniqueRemove1666328512120 implements MigrationInterface {
    name = 'queueUniqueRemove1666328512120'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "song_queue" DROP CONSTRAINT "UQ_5d3fc417dedce769b95c031dc68"`);
        await queryRunner.query(`ALTER TABLE "song_queue" DROP COLUMN "isPlaying"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "song_queue" ADD "isPlaying" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "song_queue" ADD CONSTRAINT "UQ_5d3fc417dedce769b95c031dc68" UNIQUE ("id", "userId")`);
    }

}
