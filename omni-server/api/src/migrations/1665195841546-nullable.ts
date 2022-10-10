import { MigrationInterface, QueryRunner } from "typeorm";

export class nullable1665195841546 implements MigrationInterface {
    name = 'nullable1665195841546'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "song" ALTER COLUMN "album" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "song" ALTER COLUMN "duration" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "song" ALTER COLUMN "duration" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "song" ALTER COLUMN "album" SET NOT NULL`);
    }

}
