import { MigrationInterface, QueryRunner } from "typeorm";

export class artist1664687547848 implements MigrationInterface {
    name = 'artist1664687547848'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "artist" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_55b76e71568b5db4d01d3e394ed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "song" ADD "album" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "song" ADD "duration" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "song" ADD "artistId" integer`);
        await queryRunner.query(`ALTER TABLE "song" ADD CONSTRAINT "FK_fe76da76684ccb3d70d0f75994e" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "song" DROP CONSTRAINT "FK_fe76da76684ccb3d70d0f75994e"`);
        await queryRunner.query(`ALTER TABLE "song" DROP COLUMN "artistId"`);
        await queryRunner.query(`ALTER TABLE "song" DROP COLUMN "duration"`);
        await queryRunner.query(`ALTER TABLE "song" DROP COLUMN "album"`);
        await queryRunner.query(`DROP TABLE "artist"`);
    }

}
