import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from './artist.entity';
import { Repository } from 'typeorm';
import {SongService} from "../song/song.service";
import {Song} from "../song/song.entity";

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist) private artistRepository: Repository<Artist>
  ) {}

  async addArtist(userId: string, name: string) {
    return await this.artistRepository.save({
      name,
      userId,
    });
  }

  async getArtist(userId: string, artistId: number): Promise<Artist | null> {
    return await this.artistRepository.findOne({
      where: {
        userId,
        id: artistId,
      },
    });
  }

  async getArtistByName(userId: string, name: string): Promise<Artist | null> {
    return await this.artistRepository.findOne({
      where: {
        userId,
        name: name,
      },
    });
  }

  async getSongs(userId: string, artistId: number): Promise<Song[]> {
    const result = await this.artistRepository.findOne({
      where: {
        id: artistId,
        userId
      },
      relations: {
        songs: true
      }
    })

    if (!result) {
      return []
    }

    return result.songs
  }
}
