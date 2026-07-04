import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { Artist } from './artist.entity';
import { Song } from '../song/song.entity';

import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>,
  ) {}

  async create(dto: CreateArtistDto): Promise<Artist> {
    // Verify the user exists
    const user = await this.userRepository.findOne({
      where: {
        id: dto.userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Ensure the user doesn't already have an artist profile
    const existingArtistForUser = await this.artistRepository.findOne({
      where: {
        user: {
          id: dto.userId,
        },
      },
    });

    if (existingArtistForUser) {
      throw new BadRequestException('This user already has an artist profile');
    }

    // Ensure the artist name is unique
    const existingArtist = await this.artistRepository.findOne({
      where: {
        name: dto.name,
      },
    });

    if (existingArtist) {
      throw new ConflictException('Artist with this name already exists');
    }

    // Create the artist
    const artist = this.artistRepository.create({
      name: dto.name,
      stageName: dto.stageName,
      imageUrl: dto.imageUrl,
      coverImageUrl: dto.coverImageUrl,
      biography: dto.biography,
      country: dto.country,
      city: dto.city,
      birthDate: dto.birthDate,
      verified: dto.verified ?? false,
      monthlyListeners: dto.monthlyListeners ?? 0,
      followers: dto.followers ?? 0,
      user,
    });

    // Attach songs if provided
    if (dto.songIds?.length) {
      const songs = await this.songRepository.find({
        where: {
          id: In(dto.songIds),
        },
      });

      if (songs.length !== dto.songIds.length) {
        throw new BadRequestException('One or more songs were not found');
      }

      artist.songs = songs;
    }

    return this.artistRepository.save(artist);
  }

  async findAll(page = 1, limit = 20) {
    const [items, total] = await this.artistRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        songs: true,
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
    const artist = await this.artistRepository.findOne({
      where: { id },
      relations: {
        songs: true,
      },
    });

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  async update(id: string, dto: UpdateArtistDto) {
    const artist = await this.findOne(id);

    Object.assign(artist, dto);

    if (dto.songIds) {
      const songs = await this.songRepository.find({
        where: {
          id: In(dto.songIds),
        },
      });

      artist.songs = songs;
    }

    return this.artistRepository.save(artist);
  }

  async remove(id: string) {
    const artist = await this.findOne(id);

    await this.artistRepository.remove(artist);

    return {
      message: 'Artist deleted',
    };
  }
}
