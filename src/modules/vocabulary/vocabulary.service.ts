import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Vocabulary, Prisma } from '@prisma/client';
import { vocabularyCreateSchema, vocabularyUpdateSchema } from '../../common/schemas/vocabulary.schema';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import axios from 'axios';

@Injectable()
export class VocabularyService {
  constructor(private prisma: PrismaService) {}

  private async fetchAudioUrl(word: string): Promise<string | null> {
    try {
      interface Phonetic {
        audio?: string;
        text?: string;
      }
      interface DictionaryResponse {
        phonetics: Phonetic[];
        word: string;
      }
      const response = await axios.get<DictionaryResponse[]>(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
      );
      const data = response.data;
      if (!Array.isArray(data) || !data[0] || !Array.isArray(data[0].phonetics)) {
        return null;
      }
      const phonetic = data[0].phonetics.find(p => p && typeof p === 'object' && p.audio && p.audio.trim() !== '');
      return phonetic?.audio || null;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Failed to fetch audio for word: ${word}`, error.message);
      } else {
        console.error(`Failed to fetch audio for word: ${word}`, 'Unknown error');
      }
      return null;
    }
  }

  async findByObjectId(objectId: number): Promise<Vocabulary[]> {
    const vocabularies = await this.prisma.vocabulary.findMany({
      where: { objectId },
      include: {
        object: true,
      },
    });

    if (!vocabularies.length) {
      throw new NotFoundException(`No vocabularies found for object ${objectId}`);
    }

    return vocabularies;
  }

  async create(createVocabularyDto: CreateVocabularyDto): Promise<Vocabulary> {
    try {
      // Validate với schema
      const validated = vocabularyCreateSchema.parse(createVocabularyDto);

      const audioUrl = validated.audioUrl || await this.fetchAudioUrl(validated.englishWord);

      const prismaData: Prisma.VocabularyCreateInput = {
        englishWord: validated.englishWord,
        vietnameseTranslation: validated.vietnameseTranslation,
        pronunciation: validated.pronunciation,
        audioUrl,
        examples: JSON.stringify(validated.examples || []),
        object: {
          connect: { id: validated.objectId }
        },
      };

      return this.prisma.vocabulary.create({
        data: prismaData,
        include: {
          object: true,
        },
      });
    } catch (error) {
      if (error) {
        throw new BadRequestException(error);
      }
      throw error;
    }
  }

  async update(id: number, objectId: number, updateVocabularyDto: UpdateVocabularyDto): Promise<Vocabulary> {
    try {
      console.log('Update DTO received:', updateVocabularyDto);
      // Validate dữ liệu với schema
      try {
        const validated = vocabularyUpdateSchema.parse(updateVocabularyDto);
        console.log('Validated data:', validated);
      } catch (validationError) {
        console.error('Validation error:', validationError);
        throw new BadRequestException(validationError);
      }
       // Kiểm tra vocabulary tồn tại
      const vocabulary = await this.prisma.vocabulary.findFirst({
        where: {
          id,
          objectId
        }
      });
      if (!vocabulary) {
        throw new NotFoundException(`Vocabulary with ID ${id} for object ${objectId} not found`);
      }
      // Chuẩn bị data update
      const updateData: Prisma.VocabularyUpdateInput = {};
      if (updateVocabularyDto.englishWord) {
        updateData.englishWord = updateVocabularyDto.englishWord;
      }
      if (updateVocabularyDto.vietnameseTranslation) {
        updateData.vietnameseTranslation = updateVocabularyDto.vietnameseTranslation;
      }
      if (updateVocabularyDto.pronunciation) {
        updateData.pronunciation = updateVocabularyDto.pronunciation;
      }
      if (updateVocabularyDto.examples) {
        // Đảm bảo examples là mảng
        const examples = Array.isArray(updateVocabularyDto.examples)
          ? updateVocabularyDto.examples
          : [updateVocabularyDto.examples];
        updateData.examples = JSON.stringify(examples);
      }
      if (updateVocabularyDto.audioUrl) {
        updateData.audioUrl = updateVocabularyDto.audioUrl;
      }
      console.log('Update data prepared:', updateData);
      // Thực hiện update
      const updated = await this.prisma.vocabulary.update({
        where: { id },
        data: updateData,
        include: {
          object: true,
        },
      });
      console.log('Updated result:', updated);
      return updated;
    } catch (error) {
      console.error('Update error:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }

  async remove(id: number): Promise<Vocabulary> {
    const vocabulary = await this.prisma.vocabulary.delete({
      where: { id },
    });
    return vocabulary;
  }

  async updateMissingAudioUrls(): Promise<void> {
    const vocabularies = await this.prisma.vocabulary.findMany({
      where: {
        audioUrl: null,
      },
    });

    for (const vocab of vocabularies) {
      const audioUrl = await this.fetchAudioUrl(vocab.englishWord);
      if (audioUrl) {
        await this.prisma.vocabulary.update({
          where: { id: vocab.id },
          data: { audioUrl },
        });
      }
    }
  }
}
