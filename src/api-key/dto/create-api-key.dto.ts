import { IsString, IsOptional, IsInt, Min, MaxLength } from 'class-validator';

export class CreateApiKeyDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  expiresInDays?: number;
}
