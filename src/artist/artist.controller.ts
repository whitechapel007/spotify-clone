import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ArtistService } from './artist.service';

import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

import { ArtistOwnershipGuard } from './guards/artist-ownership.guard';
import { SelfOrAdminGuard } from 'src/auth/guards/self-or-admin.guard';
import { JwtOrApiKeyAuthGuard } from 'src/api-key/guards/jwt-or-api-key-auth.guard';

@Controller('artists')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  @UseGuards(JwtOrApiKeyAuthGuard, SelfOrAdminGuard)
  create(@Body() dto: CreateArtistDto) {
    return this.artistService.create(dto);
  }

  @Get()
  @UseGuards(JwtOrApiKeyAuthGuard, SelfOrAdminGuard)
  findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.artistService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artistService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.ARTIST)
  @UseGuards(JwtOrApiKeyAuthGuard, RolesGuard, ArtistOwnershipGuard)
  update(@Param('id') id: string, @Body() dto: UpdateArtistDto) {
    return this.artistService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.ARTIST)
  @UseGuards(JwtOrApiKeyAuthGuard, RolesGuard, ArtistOwnershipGuard)
  remove(@Param('id') id: string) {
    return this.artistService.remove(id);
  }
}
