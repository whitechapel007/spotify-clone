import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Artist } from 'src/artist/artist.entity';
import { SelfOrAdminGuard } from 'src/auth/guards/self-or-admin.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User, Artist])],
  controllers: [UserController],
  providers: [UserService, SelfOrAdminGuard],
  exports: [UserService],
})
export class UserModule {}
