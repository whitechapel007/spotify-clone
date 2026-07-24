import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiKey } from './api-key.entity';
import { ApiKeyService } from './api-key.service';
import { ApiKeyController } from './api-key.controller';
import { ApiKeyAuthGuard } from './guards/api-key-auth.guard';
import { JwtOrApiKeyAuthGuard } from './guards/jwt-or-api-key-auth.guard';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ApiKey]), AuthModule],
  controllers: [ApiKeyController],
  providers: [ApiKeyService, ApiKeyAuthGuard, JwtOrApiKeyAuthGuard],
  exports: [ApiKeyAuthGuard, JwtOrApiKeyAuthGuard],
})
export class ApiKeyModule {}
