import { Module } from '@nestjs/common';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from '../song/song.entity';
import { User } from '../user/user.entity';
import { Playlist } from './playlist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Song, User, Playlist ])],
  controllers: [PlaylistController],
  providers: [PlaylistService],
})
export class PlaylistModule {}
