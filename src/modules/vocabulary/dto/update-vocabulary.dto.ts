import { ApiProperty } from '@nestjs/swagger';
import { ZodValidationPipe } from 'src/common/pipes';
import { vocabularyUpdateSchema, UpdateVocabulary } from 'src/common/schemas';
export class UpdateVocabularyDto implements UpdateVocabulary {
  @ApiProperty({ required: false, description: 'English word' })
  englishWord?: string;

  @ApiProperty({ required: false, description: 'Vietnamese translation' })
  vietnameseTranslation?: string;

  @ApiProperty({ required: false, description: 'Pronunciation' })
  pronunciation?: string;

  @ApiProperty({ required: false })
  audioUrl?: string;

  @ApiProperty({ required: false})
  examples?: string[];

  @ApiProperty({ required: false })
  objectId?: number;
}
export const UpdateVocabularyPipe = new ZodValidationPipe(vocabularyUpdateSchema);