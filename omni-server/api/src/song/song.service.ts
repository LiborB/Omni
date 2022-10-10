import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from './song.entity';
import { Repository } from 'typeorm';
import { parseBuffer } from 'music-metadata';
import path from 'path';
import { PlaylistService } from '../playlist/playlist.service';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';

export interface AddSongPayload {
  userId: string;
  files: {
    filename: string;
    buffer: Buffer;
    mimeType: string;
  }[];
}

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song) private songRepository: Repository<Song>,
    private playlistService: PlaylistService,
    private artistService: ArtistService,
    private albumService: AlbumService,
  ) {}

  async getAllSongs(userId: string): Promise<Song[]> {
    return await this.songRepository.find({
      where: {
        userId: userId,
      },
      relations: {
        album: true,
        artist: true,
      },
    });
  }

  async getSongs(userId: string, playlistId: number): Promise<Song[]> {
    return await this.playlistService.getPlaylistSongs(userId, playlistId);
  }

  async addSongs(data: AddSongPayload) {
    for (const file of data.files) {
      const fileInfo = await parseBuffer(file.buffer, file.mimeType, {
        duration: true,
      });
      const song = new Song();
      song.userId = data.userId;

      if (fileInfo.common.title) {
        song.title = fileInfo.common.title;
      } else {
        song.title = path.parse(file.filename).name;
      }

      if (fileInfo.common.artist) {
        const existingArtist = await this.artistService.getArtistByName(
          data.userId,
          fileInfo.common.artist,
        );

        if (existingArtist) {
          song.artist = existingArtist;
        } else {
          song.artist = await this.artistService.addArtist(
            data.userId,
            fileInfo.common.artist,
          );
        }
      }

      if (fileInfo.common.album) {
        const existingAlbum = await this.albumService.getAlbumByName(
          data.userId,
          fileInfo.common.album,
        );

        if (existingAlbum) {
          song.album = existingAlbum;
        } else {
          song.album = await this.albumService.addAlbum(
            data.userId,
            fileInfo.common.album,
          );
        }
      }

      song.duration = fileInfo.format.duration
        ? Math.ceil(fileInfo.format.duration)
        : undefined;

      await this.songRepository.save(song);
    }
  }
}
