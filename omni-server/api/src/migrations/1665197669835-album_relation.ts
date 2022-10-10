import { MigrationInterface, QueryRunner } from "typeorm";

export class albumRelation1665197669835 implements MigrationInterface {
    name = 'albumRelation1665197669835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "song" RENAME COLUMN "album" TO "albumId"`);
        await queryRunner.query(`CREATE TABLE "album" ("id" SERIAL NOT NULL, "userId" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_ac6ed51dd51ad6c93a335b8fcda" UNIQUE ("userId", "name"), CONSTRAINT "PK_58e0b4b8a31bb897e6959fe3206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "song" DROP COLUMN "albumId"`);
        await queryRunner.query(`ALTER TABLE "song" ADD "albumId" integer`);
        await queryRunner.query(`ALTER TABLE "song" ADD CONSTRAINT "FK_c529927ae410af49faaf2e239a5" FOREIGN KEY ("albumId") REFERENCES "album"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "song" DROP CONSTRAINT "FK_c529927ae410af49faaf2e239a5"`);
        await queryRunner.query(`ALTER TABLE "song" DROP COLUMN "albumId"`);
        await queryRunner.query(`ALTER TABLE "song" ADD "albumId" character varying`);
        await queryRunner.query(`DROP TABLE "album"`);
        await queryRunner.query(`ALTER TABLE "song" RENAME COLUMN "albumId" TO "album"`);
    }

}
