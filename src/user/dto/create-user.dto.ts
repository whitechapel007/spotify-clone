import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(100)
  firstName: string;

  @IsString()
  @MaxLength(100)
  lastName: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  username?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;
}
