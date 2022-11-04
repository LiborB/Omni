import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SongQueue } from './queue.entity';
import {MoreThan, Not, Repository} from 'typeorm';
import {NotEquals} from "class-validator";

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

  async addSong(songId: number, userId: string, isPlaying: boolean) {
    const latest = await this.songQueueRepository.findOne({
      where: {
        userId,
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
      isPlaying
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

  async updatePlayingStatus(id: number, userId: string, isPlaying: boolean) {
    const userItems = await this.songQueueRepository.find({
      where: {
        userId,
        id: Not(id)
      }
    })
    userItems.forEach(item => item.isPlaying = false)


    const item = await this.songQueueRepository.findOneBy({
      id, userId
    })

    if (item) {
      item.isPlaying = isPlaying

      await this.songQueueRepository.save(userItems.concat(item))
    }
  }

  async setNextSongPlaying(userId: string) {
    const currentPlayingItem = await this.songQueueRepository.findOneBy({
      userId, isPlaying: true
    })

    if (!currentPlayingItem) {
      return
    }

    const possibleNextItem = await this.songQueueRepository.findOne({
      where: {
        userId,
        order: MoreThan(currentPlayingItem.order)
      },
      order: {
        order: "ASC"
      }
    })

    if (possibleNextItem) {
      currentPlayingItem.isPlaying = false
      possibleNextItem.isPlaying = true

      await this.songQueueRepository.save([currentPlayingItem, possibleNextItem])
    }
  }

  async setPreviousSongPlaying(userId: string) {
    const currentPlayingItem = await this.songQueueRepository.findOneBy({
      userId, isPlaying: true
    })
  }
}
