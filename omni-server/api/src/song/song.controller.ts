import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  StreamableFile,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { SongService } from './song.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { data } from 'aws-cdk/lib/logging';
import { ApiNotFoundResponse } from '@nestjs/swagger';

@Controller('song')
export class SongController {
  constructor(private songService: SongService) {}

  @Get('all')
  getAllSongs(@Req() req) {
    return this.songService.getAllSongs(req.userId);
  }

  @Get('playlist/:id')
  getSongs(@Param('id') playlistId: number, @Req() req) {
    return this.songService.getSongs(req.userId, playlistId);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async addSongs(@UploadedFiles() files: Express.Multer.File[], @Req() req) {
    await this.songService.addSongs({
      userId: req.userId,
      files: files.map((file) => ({
        buffer: file.buffer,
        mimeType: file.mimetype,
        filename: file.originalname,
      })),
    });
  }

  @Post(':songId/playlist/:playlistId')
  async addSongToPlaylist(
    @Req() req,
    @Param('songId') songId: string,
    @Param('playlistId') playlistId: string,
  ) {
    await this.songService.addSongToPlaylist(req.userId, +songId, +playlistId);
  }

  @Get(':songId/play')
  async playSong(@Req() req, @Param('songId') songId: string) {
    const songData = await this.songService.getSongData(+songId, req.userId);

    if (!songData) {
      return ApiNotFoundResponse();
    }

    return new StreamableFile(songData.data);
  }
}
