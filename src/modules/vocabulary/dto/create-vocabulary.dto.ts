import { ApiProperty } from '@nestjs/swagger';
import { ZodValidationPipe } from 'src/common/pipes';
import { vocabularyCreateSchema, CreateVocabulary} from 'src/common/schemas';
export class CreateVocabularyDto implements CreateVocabulary{
    @ApiProperty({ description: 'English word' })
    englishWord: string;

    @ApiProperty({ description: 'Vietnamese translation' })
    vietnameseTranslation: string;

    @ApiProperty({ description: 'Pronunciation' })
    pronunciation: string;

    @ApiProperty({ required: false })
    audioUrl?: string;

    @ApiProperty({ required: false})
    examples: string[];

    @ApiProperty()
    objectId: number;
}
export const CreateVocabularyPipe = new ZodValidationPipe(vocabularyCreateSchema);