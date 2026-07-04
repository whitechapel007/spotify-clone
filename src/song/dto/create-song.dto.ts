import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateSongDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  slug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  album?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  genre?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  trackNumber?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  discNumber?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  durationInSeconds?: number;

  @IsOptional()
  @IsUrl()
  coverImageUrl?: string;

  @IsOptional()
  @IsUrl()
  audioUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  isrc?: string;

  @IsOptional()
  @IsBoolean()
  explicit?: boolean;

  @IsDateString()
  releasedDate: Date;

  @IsOptional()
  @IsString()
  lyrics?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  artistIds?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  playlistIds?: string[];
}
