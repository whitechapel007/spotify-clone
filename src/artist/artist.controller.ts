import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/user.entity';
import { ArtistOwnershipGuard } from './guards/artist-ownership.guard';

@Controller('artists')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  @Roles(Role.ADMIN, Role.ARTIST)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() dto: CreateArtistDto, @CurrentUser() user: User) {
    if (user.role !== Role.ADMIN && dto.userId !== user.id) {
      throw new ForbiddenException(
        'You can only create an artist profile for yourself',
      );
    }

    return this.artistService.create(dto);
  }

  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.artistService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artistService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.ARTIST)
  @UseGuards(JwtAuthGuard, RolesGuard, ArtistOwnershipGuard)
  update(@Param('id') id: string, @Body() dto: UpdateArtistDto) {
    return this.artistService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.ARTIST)
  @UseGuards(JwtAuthGuard, RolesGuard, ArtistOwnershipGuard)
  remove(@Param('id') id: string) {
    return this.artistService.remove(id);
  }
}
