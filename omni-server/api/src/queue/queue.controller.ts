import {Body, Controller, Get, Param, Post, Query, Req} from '@nestjs/common';
import { QueueService } from './queue.service';
import {Request} from "express";

type UpdatePlayingStatusPayload = {
  isPlaying: boolean
}

type AddToQueuePayload = {
  isPlaying: boolean
}

@Controller('queue')
export class QueueController {
  constructor(private queueService: QueueService) {}

  @Get()
  async getQueue(@Req() req: Request) {
    return await this.queueService.getSongs(req.userId);
  }

  @Post('add/:songId')
  async addSong(@Req() req: Request, @Param('songId') songId: number, @Body() body: AddToQueuePayload) {
    await this.queueService.addSong(songId, req.userId, body.isPlaying);
  }

  @Post('remove/:id')
  async removeSong(@Req() req: Request, @Param('id') id: number) {
    await this.queueService.removeSong(id, req.userId);
  }

  @Post('clear')
  async clearQueue(@Req() req: Request) {
    await this.queueService.clear(req.userId);
  }

  @Post("playingstatus/:id")
  async updatingPlayingStatus(@Req() req: Request, @Param("id") id: number, @Body() body: UpdatePlayingStatusPayload) {
    await this.queueService.updatePlayingStatus(id, req.userId, body.isPlaying)
  }

  @Post("playnextsong")
  async playNextSong(@Req() req: Request) {
    await this.queueService.setNextSongPlaying(req.userId)
  }
}
