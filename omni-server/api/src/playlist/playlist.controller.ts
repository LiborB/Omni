import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import {Request} from "express";

class CreatePlaylistRequest {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}

class UpdatePlaylistRequest {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}

class PlaylistDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  userId: string;
}

@ApiBearerAuth()
@Controller('playlist')
@ApiTags('Playlist')
export class PlaylistController {
  constructor(private playlistService: PlaylistService) {}

  @Post()
  async createPlaylist(@Body() body: CreatePlaylistRequest, @Req() req: Request) {
    await this.playlistService.createPlaylist({
      name: body.name,
      userId: req.userId,
    });
  }

  @Patch(':id')
  @ApiNotFoundResponse({
    description: 'Playlist not found',
  })
  @ApiOkResponse()
  async updatePlaylist(
    @Body() body: UpdatePlaylistRequest,
    @Req() req: Request,
    @Param('id') playlistId: number,
  ) {
    const playlist = await this.playlistService.getPlaylist(
      req.userId,
      playlistId,
    );

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    await this.playlistService.updatePlaylist({
      name: body.name,
      playlistId: playlistId,
      userId: req.userId,
    });
  }

  @Get()
  @ApiResponse({
    type: PlaylistDto,
    isArray: true,
  })
  async getPlaylists(@Req() req: Request) {
    return await this.playlistService.getPlaylists(req.userId);
  }
}
