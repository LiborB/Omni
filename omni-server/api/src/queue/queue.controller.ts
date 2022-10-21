import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { QueueService } from './queue.service';

@Controller('queue')
export class QueueController {
  constructor(private queueService: QueueService) {}

  @Get()
  async getQueue(@Req() req) {
    return await this.queueService.getSongs(req.userId);
  }

  @Post('add/:songId')
  async addSong(@Req() req, @Param('songId') songId: number) {
    await this.queueService.addSong(songId, req.userId);
  }

  @Post('remove/:id')
  async removeSong(@Req() req, @Param('id') id: number) {
    await this.queueService.removeSong(id, req.userId);
  }

  @Post('clear')
  async clearQueue(@Req() req) {
    await this.queueService.clear(req.userId);
  }
}
