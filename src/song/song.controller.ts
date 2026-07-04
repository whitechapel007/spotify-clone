import {
  Body,
  Controller,
  Delete,
  Get,
  Post,

  Param,

  Query,
  Patch,
} from '@nestjs/common';
import { SongsService } from './song.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';

// @Controller({
//   path: 'songs',
//   scope: Scope.TRANSIENT,
// })
@Controller({
  path: 'songs',
})
export class SongsController {
  constructor(private readonly songService: SongsService) {}
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSongDto) {
    return this.songService.update(id, dto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.songService.remove(id);
  }
}
