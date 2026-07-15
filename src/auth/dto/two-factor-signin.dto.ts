import { IsString } from 'class-validator';

export class TwoFactorSigninDto {
  @IsString()
  tempToken: string;

  @IsString()
  code: string;
}
