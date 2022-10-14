import { MigrationInterface, QueryRunner } from "typeorm";

export class ext1665733012520 implements MigrationInterface {
    name = 'ext1665733012520'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "song" RENAME COLUMN "mimeType" TO "extension"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "song" RENAME COLUMN "extension" TO "mimeType"`);
    }

}
