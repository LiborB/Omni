import { MigrationInterface, QueryRunner } from "typeorm";

export class queue1666327970603 implements MigrationInterface {
    name = 'queue1666327970603'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "song_queue" ("id" SERIAL NOT NULL, "userId" character varying NOT NULL, "isPlaying" boolean NOT NULL, "order" integer NOT NULL, "songId" integer, CONSTRAINT "UQ_5d3fc417dedce769b95c031dc68" UNIQUE ("id", "userId"), CONSTRAINT "PK_02c5a99d348c4fda68d2fdfc82d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "song_queue" ADD CONSTRAINT "FK_c5c8adb728393bb380ddcef92aa" FOREIGN KEY ("songId") REFERENCES "song"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "song_queue" DROP CONSTRAINT "FK_c5c8adb728393bb380ddcef92aa"`);
        await queryRunner.query(`DROP TABLE "song_queue"`);
    }

}
