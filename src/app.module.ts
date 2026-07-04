import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { LoggerModule } from 'nestjs-pino';

import { SongsModule } from './song/song.module';
import { PlaylistModule } from './playlist/playlist.module';

import { UserModule } from './user/user.module';
import cors from 'cors';
import helmet from 'helmet';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Playlist } from './playlist/playlist.entity';
import { User } from './user/user.entity';
import { Song } from './song/song.entity';
import { Artist } from './artist/artist.entity';
import { ArtistModule } from './artist/artist.module';
import { AuthModule } from './auth/auth.module';

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
    SongsModule,
    PlaylistModule,
    UserModule,
    ArtistModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors(), helmet()).forRoutes('songs');
  }
}
