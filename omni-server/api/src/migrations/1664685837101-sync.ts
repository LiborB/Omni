import { MigrationInterface, QueryRunner } from "typeorm";

export class sync1664685837101 implements MigrationInterface {
    name = 'sync1664685837101'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "song" ("id" SERIAL NOT NULL, "title" character varying(256) NOT NULL, "userId" character varying NOT NULL, CONSTRAINT "PK_baaa977f861cce6ff954ccee285" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "playlist" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "userId" character varying NOT NULL, CONSTRAINT "PK_538c2893e2024fabc7ae65ad142" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "playlist_songs_song" ("playlistId" integer NOT NULL, "songId" integer NOT NULL, CONSTRAINT "PK_9a24b586572c2896bfb75e57fb4" PRIMARY KEY ("playlistId", "songId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3e66846398a681262e56574fc9" ON "playlist_songs_song" ("playlistId") `);
        await queryRunner.query(`CREATE INDEX "IDX_efc8204ff6cdd9f17e83f8d001" ON "playlist_songs_song" ("songId") `);
        await queryRunner.query(`ALTER TABLE "playlist_songs_song" ADD CONSTRAINT "FK_3e66846398a681262e56574fc99" FOREIGN KEY ("playlistId") REFERENCES "playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "playlist_songs_song" ADD CONSTRAINT "FK_efc8204ff6cdd9f17e83f8d001e" FOREIGN KEY ("songId") REFERENCES "song"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "playlist_songs_song" DROP CONSTRAINT "FK_efc8204ff6cdd9f17e83f8d001e"`);
        await queryRunner.query(`ALTER TABLE "playlist_songs_song" DROP CONSTRAINT "FK_3e66846398a681262e56574fc99"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_efc8204ff6cdd9f17e83f8d001"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3e66846398a681262e56574fc9"`);
        await queryRunner.query(`DROP TABLE "playlist_songs_song"`);
        await queryRunner.query(`DROP TABLE "playlist"`);
        await queryRunner.query(`DROP TABLE "song"`);
    }

}
