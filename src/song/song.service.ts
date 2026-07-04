import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Song } from './song.entity';
import { Artist } from 'src/artist/artist.entity';
import { Playlist } from 'src/playlist/playlist.entity';
import { In, Repository } from 'typeorm';

@Injectable({
  // scope: Scope.TRANSIENT,
})
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>,

    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,

    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>,
  ) {}

  async create(dto: CreateSongDto): Promise<Song> {
    const song = this.songRepository.create(dto);

    if (dto.artistIds?.length) {
      const artists = await this.artistRepository.find({
        where: {
          id: In(dto.artistIds),
        },
      });

      if (artists.length !== dto.artistIds.length) {
        throw new BadRequestException('One or more artists were not found');
      }

      song.artists = artists;
    }

    if (dto.playlistIds?.length) {
      const playlists = await this.playlistRepository.find({
        where: {
          id: In(dto.playlistIds),
        },
      });

      if (playlists.length !== dto.playlistIds.length) {
        throw new BadRequestException('One or more playlists were not found');
      }

      song.playlists = playlists;
    }

    return this.songRepository.save(song);
  }
  async findAll(page = 1, limit = 20) {
    const [items, total] = await this.songRepository.findAndCount({
      skip: (page - 1) * limit,

      take: limit,

      relations: {
        artists: true,
        playlists: true,
      },

      order: {
        createdAt: 'DESC',
      },
    });

    return {
      total,
      page,
      limit,
      items,
    };
  }

  async findOne(id: string) {
    const song = await this.songRepository.findOne({
      where: {
        id,
      },

      relations: {
        artists: true,
        playlists: true,
      },
    });

    if (!song) {
      throw new NotFoundException('Song not found');
    }

    return song;
  }

  async update(id: string, dto: UpdateSongDto) {
    const song = await this.findOne(id);

    Object.assign(song, dto);

    if (dto.artistIds) {
      const artists = await this.artistRepository.find({
        where: {
          id: In(dto.artistIds),
        },
      });

      song.artists = artists;
    }

    if (dto.playlistIds) {
      const playlists = await this.playlistRepository.find({
        where: {
          id: In(dto.playlistIds),
        },
      });

      song.playlists = playlists;
    }

    return this.songRepository.save(song);
  }

  async remove(id: string) {
    const song = await this.findOne(id);

    await this.songRepository.remove(song);

    return {
      message: 'Song deleted',
    };
  }
}
