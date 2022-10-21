import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SongQueue } from './queue.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(SongQueue)
    private songQueueRepository: Repository<SongQueue>,
  ) {}

  async getSongs(userId: string) {
    return this.songQueueRepository.find({
      where: {
        userId,
      },
      order: {
        order: 'ASC',
      },
      relations: {
        song: true,
      },
    });
  }

  async addSong(songId: number, userId: string) {
    const latest = await this.songQueueRepository.findOne({
      where: {
        userId,
        song: {
          id: songId,
        },
      },
      order: {
        order: 'DESC',
      },
    });

    const order = latest?.order ?? 0;

    await this.songQueueRepository.save({
      order: order + 1,
      userId,
      song: {
        id: songId,
      },
    });
  }

  async removeSong(id: number, userId: string) {
    const songQueue = await this.songQueueRepository.findOneByOrFail({
      userId,
      id,
    });

    await this.songQueueRepository.remove(songQueue);
  }

  async clear(userId: string) {
    const queueItems = await this.songQueueRepository.findBy({
      userId,
    });

    await this.songQueueRepository.remove(queueItems);
  }
}
