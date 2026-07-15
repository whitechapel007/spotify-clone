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
import { ConfigModule, ConfigService } from '@nestjs/config';

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

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.getOrThrow<string>('DB_HOST'),
        port: config.getOrThrow<number>('DB_PORT'),
        username: config.getOrThrow<string>('DB_USERNAME'),
        password: config.getOrThrow<string>('DB_PASSWORD'),
        database: config.getOrThrow<string>('DB_DATABASE'),
        entities: [Playlist, User, Song, Artist],
        synchronize: config.get('NODE_ENV') !== 'production',
      }),
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
