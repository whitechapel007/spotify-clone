import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes, createHash } from 'crypto';

import { ApiKey } from './api-key.entity';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { User } from '../user/user.entity';

const PREFIX_LENGTH = 8;
const SECRET_BYTES = 32;

function hashSecret(secret: string): string {
  return createHash('sha256').update(secret).digest('hex');
}

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectRepository(ApiKey)
    private readonly apiKeyRepository: Repository<ApiKey>,
  ) {}

  async create(userId: string, dto: CreateApiKeyDto) {
    const prefix = randomBytes(PREFIX_LENGTH / 2).toString('hex');
    const secret = randomBytes(SECRET_BYTES).toString('base64url');
    const rawKey = `${prefix}.${secret}`;

    const apiKey = this.apiKeyRepository.create({
      name: dto.name,
      prefix,
      hashedKey: hashSecret(secret),
      userId,
      expiresAt: dto.expiresInDays
        ? new Date(Date.now() + dto.expiresInDays * 24 * 60 * 60 * 1000)
        : null,
      revokedAt: null,
      lastUsedAt: null,
    });

    const saved = await this.apiKeyRepository.save(apiKey);

    return {
      id: saved.id,
      name: saved.name,
      key: rawKey,
      expiresAt: saved.expiresAt,
      createdAt: saved.createdAt,
    };
  }

  async findAllForUser(userId: string) {
    return this.apiKeyRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async revoke(userId: string, id: string) {
    const apiKey = await this.apiKeyRepository.findOne({
      where: { id, userId },
    });

    if (!apiKey) {
      throw new UnauthorizedException('API key not found');
    }

    apiKey.revokedAt = new Date();
    return this.apiKeyRepository.save(apiKey);
  }

  async validate(rawKey: string): Promise<User> {
    const [prefix, secret] = rawKey.split('.');

    if (!prefix || !secret) {
      throw new UnauthorizedException('Invalid API key');
    }

    const apiKey = await this.apiKeyRepository.findOne({
      where: { prefix },
      relations: { user: true },
      select: {
        id: true,
        hashedKey: true,
        expiresAt: true,
        revokedAt: true,
        user: { id: true, email: true, role: true },
      },
    });

    if (!apiKey || apiKey.hashedKey !== hashSecret(secret)) {
      throw new UnauthorizedException('Invalid API key');
    }

    if (apiKey.revokedAt || (apiKey.expiresAt && apiKey.expiresAt < new Date())) {
      throw new UnauthorizedException('API key expired or revoked');
    }

    this.apiKeyRepository.update(apiKey.id, { lastUsedAt: new Date() }).catch(() => undefined);

    return apiKey.user;
  }
}
