import { Module } from '@nestjs/common';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from '../song/song.entity';
import { User } from '../user/user.entity';
import { Playlist } from './playlist.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ApiKeyModule } from 'src/api-key/api-key.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Song, User, Playlist]),
    AuthModule,
    ApiKeyModule,
  ],
  controllers: [PlaylistController],
  providers: [PlaylistService],
  exports: [PlaylistService],
})
export class PlaylistModule {}
