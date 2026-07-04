import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreatePlaylistDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsUUID()
  userId: string;
}
