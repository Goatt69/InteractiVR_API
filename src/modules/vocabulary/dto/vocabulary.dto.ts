import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsNumber, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVocabularyDto {
  @ApiProperty({ description: 'English word' })
  @IsString()
  englishWord!: string;

  @ApiProperty({ description: 'Vietnamese translation' })
  @IsString()
  vietnameseTranslation!: string;

  @ApiProperty({ description: 'Pronunciation' })
  @IsString()
  pronunciation!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  audioUrl?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @Type(() => String)
  examples?: string[];

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  objectId!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  targetPosition?: Record<string, any>;
}

// Kế thừa từ CreateVocabularyDto nhưng tất cả các trường đều optional
export class UpdateVocabularyDto implements Partial<CreateVocabularyDto> {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  englishWord?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  vietnameseTranslation?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  pronunciation?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  audioUrl?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @Type(() => String)
  examples?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  targetPosition?: Record<string, any>;
}