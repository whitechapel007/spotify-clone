import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,

  Query,
} from '@nestjs/common';

import { UserService } from './user.service';


import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}



  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.userService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
