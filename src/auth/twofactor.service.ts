import { BadRequestException, Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

import { UserService } from '../user/user.service';

@Injectable()
export class TwoFactorService {
  constructor(private readonly userService: UserService) {}

  async generateSecret(userId: string, email: string) {
    const secret = speakeasy.generateSecret({
      name: `SpotifyClone (${email})`,
    });

    await this.userService.setTwoFactorSecret(userId, secret.base32);

    return { otpauthUrl: secret.otpauth_url as string };
  }

  async getQrCode(otpauthUrl: string) {
    return QRCode.toDataURL(otpauthUrl);
  }

  verifyCode(secret: string, code: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: code,
      window: 1,
    });
  }

  async enable(userId: string, code: string) {
    const user = await this.userService.findByIdWithTwoFactorSecret(userId);

    if (!user.twoFactorSecret) {
      throw new BadRequestException(
        'Generate a two-factor secret before enabling it',
      );
    }

    if (!this.verifyCode(user.twoFactorSecret, code)) {
      throw new BadRequestException('Invalid two-factor code');
    }

    await this.userService.setTwoFactorEnabled(userId, true);

    return { message: 'Two-factor authentication enabled' };
  }

  async disable(userId: string, code: string) {
    const user = await this.userService.findByIdWithTwoFactorSecret(userId);

    if (!user.twoFactorSecret || !this.verifyCode(user.twoFactorSecret, code)) {
      throw new BadRequestException('Invalid two-factor code');
    }

    await this.userService.setTwoFactorSecret(userId, null);
    await this.userService.setTwoFactorEnabled(userId, false);

    return { message: 'Two-factor authentication disabled' };
  }
}
