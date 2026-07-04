import { Module } from '@nestjs/common';
import { SongsService } from './song.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongsController } from './song.controller';
import { Song } from './song.entity';
import { Artist } from 'src/artist/artist.entity';
import { Playlist } from 'src/playlist/playlist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Song, Artist, Playlist])],
  providers: [SongsService],
  controllers: [SongsController],
})
export class SongsModule {}
