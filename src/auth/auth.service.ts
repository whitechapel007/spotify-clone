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
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const existing = await this.userService.findByEmail(dto.email);

    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userService.create({
      ...dto,
      password: hashedPassword,
    });

    const tokens = await this.generateTokens(user);

    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);

    await this.userService.updateRefreshToken(user.id, hashedRefreshToken);

    const { password, ...userWithoutPassword } = user;

    return {
      message: 'Account created',

      ...tokens,
      user: userWithoutPassword,
    };
  }

  async signin(dto: SigninDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const validPassword = await bcrypt.compare(dto.password, user.password);

    if (!validPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user);
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);

    await this.userService.updateRefreshToken(user.id, hashedRefreshToken);

    // password is selected as false by default; still safe to remove defensively
    const { password, ...userWithoutPassword } = user;

    return {
      ...tokens,
      user: userWithoutPassword,
    };
  }

  async logout(userId: string) {
    await this.userService.updateRefreshToken(userId, null);

    return {
      message: 'Logged out',
    };
  }

  private async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '30d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    const payload = await this.jwtService.verifyAsync(refreshToken);

    const user = await this.userService.findByIdWithRefreshToken(payload.sub);

    if (!user?.hashedRefreshToken) {
      throw new UnauthorizedException();
    }
    const matches = await bcrypt.compare(refreshToken, user.hashedRefreshToken);

    if (!matches) {
      throw new UnauthorizedException();
    }

    const tokens = await this.generateTokens(user);
    const hash = await bcrypt.hash(tokens.refreshToken, 10);
    await this.userService.updateRefreshToken(user.id, hash);

    return tokens;
  }
}
