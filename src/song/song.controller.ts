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
import { SongsService } from './song.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

// @Controller({
//   path: 'songs',
//   scope: Scope.TRANSIENT,
// })
@Controller({
  path: 'songs',
})
export class SongsController {
  constructor(private readonly songService: SongsService) {}

  @Roles(Role.ADMIN, Role.ARTIST)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createSongDto: CreateSongDto) {
    return this.songService.create(createSongDto);
  }
  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.songService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.songService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.ARTIST)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSongDto) {
    return this.songService.update(id, dto);
  }

  @Roles(Role.ADMIN, Role.ARTIST)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.songService.remove(id);
  }
}
