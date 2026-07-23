import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';

import { ApiKeyService } from './api-key.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/user.entity';

@Controller('api-keys')
@UseGuards(JwtAuthGuard)
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateApiKeyDto) {
    return this.apiKeyService.create(user.id, dto);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.apiKeyService.findAllForUser(user.id);
  }

  @Delete(':id')
  revoke(@CurrentUser() user: User, @Param('id') id: string) {
    return this.apiKeyService.revoke(user.id, id);
  }
}
