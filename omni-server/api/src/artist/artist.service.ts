import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from './artist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist) private artistRepository: Repository<Artist>,
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
}
