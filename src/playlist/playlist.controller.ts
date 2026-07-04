import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Param,
  Query,
  Patch,
  UseGuards
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { Playlist } from './playlist.entity';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';


@Controller({
  path: 'playlists',
})
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body()
    playlistDto: CreatePlaylistDto,
    @CurrentUser() user,

  ): Promise<Playlist> {
    return this.playlistService.create(playlistDto, user.id);
  }

  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.playlistService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playlistService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePlaylistDto) {
    return this.playlistService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playlistService.remove(id);
  }
}
