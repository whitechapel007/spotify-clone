import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Artist } from './artist.entity';
import { Song } from '../song/song.entity';

import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Artist, Song, User])],
  controllers: [ArtistController],
  providers: [ArtistService],
})
export class ArtistModule {}
