import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  IsArray,
  IsUUID,
  IsUrl,
} from 'class-validator';

export class CreateArtistDto {
  @IsString()
  @MaxLength(150)
  name: string;

  @IsString()
  @IsUUID('4', { each: true })
  userId: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  stageName?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsUrl()
  coverImageUrl?: string;

  @IsOptional()
  @IsString()
  biography?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: Date;

  @IsOptional()
  @IsBoolean()
  verified?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  monthlyListeners?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  followers?: number;

  // optional relationship
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  songIds?: string[];
}
