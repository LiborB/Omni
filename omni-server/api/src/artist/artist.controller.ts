import {Controller, Get, Param, Req} from '@nestjs/common';
import {Request} from "express";
import {ArtistService} from "./artist.service";

@Controller('artist')
export class ArtistController {
    constructor(private artistService: ArtistService) {
    }

    @Get(":id/songs")
    async getSongs(@Req() req: Request, @Param("id") artistId: number) {
        return await this.artistService.getSongs(req.userId, artistId)
    }

    @Get(":id")
    async getArtist(@Req() req: Request, @Param("id") artistId: number) {
        return await this.artistService.getArtist(req.userId, artistId)
    }
}
