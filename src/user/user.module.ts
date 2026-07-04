import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Artist } from 'src/artist/artist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Artist])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
