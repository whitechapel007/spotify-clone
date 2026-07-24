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
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { SelfOrAdminGuard } from 'src/auth/guards/self-or-admin.guard';
import { JwtOrApiKeyAuthGuard } from 'src/api-key/guards/jwt-or-api-key-auth.guard';

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
  @UseGuards(JwtOrApiKeyAuthGuard, RolesGuard)
  @Post()
  create(@Body() createSongDto: CreateSongDto) {
    return this.songService.create(createSongDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(JwtOrApiKeyAuthGuard, RolesGuard)
  findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.songService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  @UseGuards(JwtOrApiKeyAuthGuard, SelfOrAdminGuard)
  findOne(@Param('id') id: string) {
    return this.songService.findOne(id);
  }

  @UseGuards(JwtOrApiKeyAuthGuard, SelfOrAdminGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSongDto) {
    return this.songService.update(id, dto);
  }

  @UseGuards(JwtOrApiKeyAuthGuard, SelfOrAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.songService.remove(id);
  }
}
