import { Module } from '@nestjs/common';
import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongQueue } from './queue.entity';
import { SongModule } from '../song/song.module';

@Module({
  imports: [TypeOrmModule.forFeature([SongQueue]), SongModule],
  controllers: [QueueController],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
