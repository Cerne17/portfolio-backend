import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  MinLength,
  IsUrl,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  content: string;

  @IsString()
  @IsNotEmpty()
  // Add slug generation logic in service or allow manual input with validation
  slug: string;

  @IsString()
  @IsOptional()
  excerpt?: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;
}
