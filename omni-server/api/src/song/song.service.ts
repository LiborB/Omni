import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from './song.entity';
import { Repository } from 'typeorm';
import { parseBuffer } from 'music-metadata';
import { extname, basename } from 'path';
import { PlaylistService } from '../playlist/playlist.service';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { SharedService } from '../shared/shared.service';
import { randomUUID } from "crypto";
import axios from 'axios';

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
    private sharedService: SharedService,
  ) { }

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
      song.extension = extname(file.filename);
      song.songKey = randomUUID()

      if (fileInfo.common.title) {
        song.title = fileInfo.common.title;
      } else {
        song.title = basename(file.filename);
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

      if (fileInfo.common.picture?.length) {
        const picture = fileInfo.common.picture[0]
        const pictureKey = randomUUID()

        song.thumbnailKey = pictureKey
        await this.sharedService.s3.send(
          new PutObjectCommand({
            Bucket: 'omni-player-thumbnail-bucket',
            Key: pictureKey,
            Body: picture.data,
            ContentType: picture.type,
          }),
        );
      }

      song.duration = fileInfo.format.duration
        ? Math.ceil(fileInfo.format.duration)
        : null;

      await this.songRepository.save(song);

      await this.sharedService.s3.send(
        new PutObjectCommand({
          Bucket: 'omni-player-song-bucket',
          Key: song.songKey,
          Body: file.buffer,
          ContentType: file.mimeType,
        }),
      );
    }
  }

  async addSongToPlaylist(userId: string, songId: number, playlistId: number) {
    const playlist = await this.playlistService.getPlaylist(userId, playlistId);
    const song = await this.songRepository.findOneOrFail({
      where: {
        id: songId,
      },
      relations: {
        playlists: true,
      },
    });

    if (song.playlists.some((playlist) => playlist.id === playlistId)) {
      return;
    }

    song.playlists = [...song.playlists, playlist];

    await this.songRepository.save(song);
  }

  async getSongData(songId: number, userId: string) {
    const song = await this.songRepository.findOneBy({
      userId,
      id: songId,
    });

    if (!song) {
      return null;
    }

    const response = await axios.get(this.sharedService.generateCloudfrontSignedUrl(`${process.env.SONG_BASE_URL}/${song.songKey}`), {
      responseType: "arraybuffer"
    })

    return {
      data: new Uint8Array(response.data as ArrayBuffer),
      extension: song.extension,
    };
  }

  async getSongThumbnail(songId: string, userId: string): Promise<Uint8Array | null> {
    const song = await this.songRepository.findOneBy({
      id: +songId,
      userId
    })

    if (!song?.thumbnailKey) {
      return null
    }

    const response = await axios.get(this.sharedService.generateCloudfrontSignedUrl(`${process.env.THUMBNAIL_BASE_URL}/${song.thumbnailKey}`), {
      responseType: "arraybuffer"
    })

    return new Uint8Array(response.data as ArrayBuffer)
  }
}
