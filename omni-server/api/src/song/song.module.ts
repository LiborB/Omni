import { Module } from '@nestjs/common';
import { SongService } from './song.service';
import { SongController } from './song.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './song.entity';
import { PlaylistModule } from '../playlist/playlist.module';
import { ArtistModule } from '../artist/artist.module';
import { AlbumModule } from '../album/album.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Song]),
    ArtistModule,
    PlaylistModule,
    AlbumModule,
  ],
  providers: [SongService],
  controllers: [SongController],
})
export class SongModule {}
