import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: dto.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = this.userRepository.create(dto);

    return this.userRepository.save(user);
  }

  async findAll(page = 1, limit = 20) {
    const [items, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
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

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        playlists: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateRefreshToken(
    userId: string,

    hash: string | null,
  ) {
    await this.userRepository.update(userId, {
      hashedRefreshToken: hash,
    });
  }

  async logout(userId: string) {
    await this.userRepository.update(userId, {
      hashedRefreshToken: null,
    });

    return {
      message: 'Logged out successfully',
    };
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        username: true,
        country: true,
        avatarUrl: true,
      },
    });
  }

  async findByIdWithRefreshToken(id: string) {
    return this.userRepository.findOne({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        password: true,
        hashedRefreshToken: true,
        firstName: true,
        lastName: true,
        username: true,
        avatarUrl: true,
        country: true,
      },
    });
  }
  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    Object.assign(user, dto);

    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);

    await this.userRepository.remove(user);

    return {
      message: 'User deleted',
    };
  }
}
