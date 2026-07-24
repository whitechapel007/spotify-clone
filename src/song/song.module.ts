import { Module } from '@nestjs/common';
import { SongsService } from './song.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongsController } from './song.controller';
import { Song } from './song.entity';
import { Artist } from 'src/artist/artist.entity';
import { Playlist } from 'src/playlist/playlist.entity';
import { ApiKeyModule } from 'src/api-key/api-key.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Song, Artist, Playlist]),
    AuthModule,
    ApiKeyModule,
  ],
  providers: [SongsService],
  controllers: [SongsController],
})
export class SongsModule {}
