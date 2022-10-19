import { Controller, Param, Post, Req } from '@nestjs/common';
import { QueueService } from './queue.service';

@Controller('queue')
export class QueueController {
  constructor(private queueService: QueueService) {}

  @Post(':songId')
  async addSong(@Req() req, @Param('songId') songId: number) {}
}
