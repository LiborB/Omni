import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from './playlist.entity';
import { Repository } from 'typeorm';
import { Song } from '../song/song.entity';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
  ) {}

  async createPlaylist(data: { name: string; userId: string }) {
    await this.playlistRepository.save({
      name: data.name,
      userId: data.userId,
    });
  }

  async getPlaylists(userId: string) {
    return await this.playlistRepository.find({
      where: {
        userId,
      },
    });
  }

  async getPlaylist(
    userId: string,
    playlistId: number,
  ): Promise<Playlist | null> {
    return await this.playlistRepository.findOne({
      where: {
        userId,
        id: playlistId,
      },
    });
  }

  async getPlaylistSongs(
    userId: string,
    playlistId: number,
  ): Promise<Song[] | null> {
    const result = await this.playlistRepository.findOne({
      where: {
        userId,
        id: playlistId,
      },
      relations: {
        songs: {
          artist: true,
          album: true,
        },
      },
    });

    return result.songs;
  }

  async updatePlaylist(data: {
    userId: string;
    playlistId: number;
    name: string;
  }) {
    return await this.playlistRepository.update(
      {
        userId: data.userId,
        id: data.playlistId,
      },
      {
        name: data.name,
      },
    );
  }
}
