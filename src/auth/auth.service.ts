import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';

import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const existing = await this.userService.findByEmail(dto.email);

    if (existing) {
      throw new ConflictException(
        'Email already exists',
      );
    }

    const hashedPassword = await bcrypt.hash(
      dto.password,
      10,
    );

    const user = await this.userService.create({
      ...dto,
      password: hashedPassword,
    });

    const token = await this.generateToken(user.id);

    return {
      message: 'Account created',
      accessToken: token,
      user,
    };
  }

  async signin(dto: SigninDto) {
    const user = await this.userService.findByEmail(
      dto.email,
    );

    if (!user) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    const validPassword = await bcrypt.compare(
      dto.password,
      user.password,
    );

    if (!validPassword) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    const token = await this.generateToken(user.id);

    delete user?.password;

    return {
      accessToken: token,
      user,
    };
  }

  private async generateToken(
    userId: string,
  ): Promise<string> {
    return this.jwtService.signAsync({
      sub: userId,
    });
  }
}
