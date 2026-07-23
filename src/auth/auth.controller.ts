import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { TwoFactorService } from './twofactor.service';

import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { Verify2faDto } from './dto/verify-2fa.dto';
import { TwoFactorSigninDto } from './dto/two-factor-signin.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from 'src/user/user.entity';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly twoFactorService: TwoFactorService,
  ) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: SigninDto) {
    return this.authService.signin(dto);
  }

  @Post('2fa/authenticate')
  authenticate2fa(@Body() dto: TwoFactorSigninDto) {
    return this.authService.authenticate2fa(dto);
  }

  @Post('2fa/generate')
  @UseGuards(JwtAuthGuard)
  async generate2fa(@CurrentUser() user: User) {
    const { otpauthUrl } = await this.twoFactorService.generateSecret(
      user.id,
      user.email,
    );

    const qrCodeDataUrl = await this.twoFactorService.getQrCode(otpauthUrl);

    return { qrCodeDataUrl };
  }

  @Post('2fa/enable')
  @UseGuards(JwtAuthGuard)
  enable2fa(@CurrentUser() user: User, @Body() dto: Verify2faDto) {
    return this.twoFactorService.enable(user.id, dto.code);
  }

  @Post('2fa/disable')
  @UseGuards(JwtAuthGuard)
  disable2fa(@CurrentUser() user: User, @Body() dto: Verify2faDto) {
    return this.twoFactorService.disable(user.id, dto.code);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@CurrentUser() user: User) {
    return this.authService.logout(user.id);
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }
}
