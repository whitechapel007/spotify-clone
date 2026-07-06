import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from './playlist.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Song } from 'src/song/song.entity';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Song) private readonly songRepository: Repository<Song>,
  ) {}

  async create(dto: CreatePlaylistDto, userId: string): Promise<Playlist> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const playlist = this.playlistRepository.create({
      name: dto.name,
      description: dto.description,
      coverImageUrl: dto.coverImageUrl,
      isPublic: dto.isPublic ?? true,
      user,
    });

    return this.playlistRepository.save(playlist);
  }

  async findAll(page = 1, limit = 20) {
    const [items, total] = await this.playlistRepository.findAndCount({
      skip: (page - 1) * limit,

      take: limit,

      relations: {
        user: true,
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
    const playlist = await this.playlistRepository.findOne({
      where: {
        id,
      },

      relations: {
        user: true,
        songs: true,
      },
    });

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    return playlist;
  }

  async findUserPlaylists(userId: string) {
    return this.playlistRepository.find({
      where: {
        user: {
          id: userId,
        },
      },

      relations: {
        songs: true,
      },

      order: {
        createdAt: 'DESC',
      },
    });
  }

  async update(id: string, dto: UpdatePlaylistDto) {
    const playlist = await this.findOne(id);

    Object.assign(playlist, dto);

    return this.playlistRepository.save(playlist);
  }

  async remove(id: string) {
    const playlist = await this.findOne(id);

    await this.playlistRepository.remove(playlist);

    return {
      message: 'Playlist deleted',
    };
  }

  async addSongs(playlistId: string, songIds: string[]) {
    const playlist = await this.findOne(playlistId);

    const songs = await this.songRepository.find({
      where: {
        id: In(songIds),
      },
    });

    playlist.songs.push(...songs);

    return this.playlistRepository.save(playlist);
  }
}
