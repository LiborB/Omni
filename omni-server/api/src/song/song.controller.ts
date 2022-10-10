import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { SongService } from './song.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { data } from 'aws-cdk/lib/logging';

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

  @Post(':id?')
  @UseInterceptors(FilesInterceptor('files'))
  async addSongs(@UploadedFiles() files: Express.Multer.File[], @Req() req) {
    await this.songService.addSongs({
      userId: req.userId,
      files: files.map((file) => ({
        buffer: file.buffer,
        mimeType: file.mimetype,
        filename: file.filename,
      })),
    });
  }
}
