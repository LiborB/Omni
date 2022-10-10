import { Injectable } from '@nestjs/common';
import { Artist } from '../artist/artist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from './album.entity';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album) private albumRepository: Repository<Album>,
  ) {}

  async addAlbum(userId: string, name: string) {
    return await this.albumRepository.save({
      name,
      userId,
    });
  }

  async getAlbumByName(userId: string, name: string): Promise<Album | null> {
    return await this.albumRepository.findOne({
      where: {
        userId,
        name: name,
      },
    });
  }
}
