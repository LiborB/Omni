import { Module } from '@nestjs/common';
import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';

@Module({
  controllers: [QueueController],
  providers: [QueueService]
})
export class QueueModule {}
