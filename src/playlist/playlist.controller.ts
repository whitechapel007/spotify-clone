import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Param,
  Query,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { Playlist } from './playlist.entity';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from 'src/user/user.entity';
import { SelfOrAdminGuard } from 'src/auth/guards/self-or-admin.guard';

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
    @CurrentUser() user: User,
  ): Promise<Playlist> {
    return this.playlistService.create(playlistDto, user.id);
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @CurrentUser() user?: User,
  ) {
    return this.playlistService.findAll(Number(page), Number(limit), user);
  }

  @Get(':id')
   @UseGuards(JwtAuthGuard, SelfOrAdminGuard)
  findOne(@Param('id') id: string, @CurrentUser() user?: User) {
    return this.playlistService.findOne(id, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, SelfOrAdminGuard)
  update(@Param('id') id: string, @Body() dto: UpdatePlaylistDto) {
    return this.playlistService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, SelfOrAdminGuard)
  remove(@Param('id') id: string) {
    return this.playlistService.remove(id);
  }
}
