import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { LoggerModule } from 'nestjs-pino';

import { SongsModule } from './song/song.module';
import { PlaylistModule } from './playlist/playlist.module';

import { UserModule } from './user/user.module';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Playlist } from './playlist/playlist.entity';
import { User } from './user/user.entity';
import { Song } from './song/song.entity';
import { Artist } from './artist/artist.entity';
import { ArtistModule } from './artist/artist.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5434,
      username: 'postgres',
      password: 'password',
      database: 'nestdb',
      entities: [Playlist, User, Song, Artist],
      synchronize: true,
    }),

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    SongsModule,
    PlaylistModule,
    UserModule,
    ArtistModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
