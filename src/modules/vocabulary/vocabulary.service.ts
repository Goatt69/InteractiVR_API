import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Vocabulary, Prisma } from '@prisma/client';
import { CreateVocabularyDto, UpdateVocabularyDto } from './dto/vocabulary.dto';
import axios from 'axios';

@Injectable()
export class VocabularyService {
  constructor(private prisma: PrismaService) {}

  private async fetchAudioUrl(word: string): Promise<string | null> {
    try {
      // Định nghĩa kiểu dữ liệu rõ ràng cho response
      interface Phonetic {
        audio?: string;
        text?: string;
      }

      interface DictionaryResponse {
        phonetics: Phonetic[];
        word: string;
        // Thêm các trường khác nếu cần
      }

      // Sử dụng encodeURIComponent để tránh các ký tự đặc biệt trong URL
      const response = await axios.get<DictionaryResponse[]>(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
      );

      // Truy cập an toàn vào dữ liệu
      const data = response.data;

      // Kiểm tra dữ liệu trả về
      if (!Array.isArray(data) || !data[0] || !Array.isArray(data[0].phonetics)) {
        return null;
      }

      // Tìm phần tử có audio
      const phonetic = data[0].phonetics.find(p => p && typeof p === 'object' && p.audio && p.audio.trim() !== '');
      return phonetic?.audio || null;

    } catch (error) {
      // Xử lý lỗi an toàn
      if (error instanceof Error) {
        console.error(`Failed to fetch audio for word: ${word}`, error.message);
      } else {
        console.error(`Failed to fetch audio for word: ${word}`, 'Unknown error');
      }
      return null;
    }
  }

  ///
  async findByObjectId(objectId: number): Promise<Vocabulary[]> {
    const vocabularies = await this.prisma.vocabulary.findMany({
      where: { objectId },
      include: {
        object: true,
        objectParts: true,
      },
    });

    if (!vocabularies.length) {
      throw new NotFoundException(`No vocabularies found for object ${objectId}`);
    }

    return vocabularies;
  }

  // Lấy từ vựng theo identifier của object 3D
  async findByObjectIdentifier(objectIdentifier: string, themeId: number): Promise<Vocabulary[]> {
    return this.prisma.vocabulary.findMany({
      where: {
        object: {
          objectIdentifier: objectIdentifier,
          themeId: themeId,
        },
      },
      include: {
        object: true,
        objectParts: true,
      },
    });
  }

  async findAll(): Promise<Vocabulary[]> {
    return this.prisma.vocabulary.findMany({
      include: {
        object: true,
      },
    });
  }

  async findOne(id: number): Promise<Vocabulary | null> {
    const vocabulary = await this.prisma.vocabulary.findUnique({
      where: { id },
      include: {
        object: true,
        objectParts: true,
      },
    });

    if (!vocabulary) {
      throw new NotFoundException(`Vocabulary with ID ${id} not found`);
    }

    return vocabulary;
  }

  async create(createDto: CreateVocabularyDto): Promise<Vocabulary> {
    const audioUrl = createDto.audioUrl || await this.fetchAudioUrl(createDto.englishWord);

    const prismaData: Prisma.VocabularyCreateInput = {
      englishWord: createDto.englishWord,
      vietnameseTranslation: createDto.vietnameseTranslation,
      pronunciation: createDto.pronunciation,
      audioUrl,
      examples: createDto.examples || [],
      object: {
        connect: { id: createDto.objectId }
      },
      targetPosition: createDto.targetPosition ,
    };

    return this.prisma.vocabulary.create({
      data: prismaData,
      include: {
        object: true,
      },
    });
  }

  async update(id: number, objectId: number, updateDto: UpdateVocabularyDto): Promise<Vocabulary> {
    const vocabulary = await this.prisma.vocabulary.findUnique({
      where: { id },
    });

    if (!vocabulary || vocabulary.objectId !== objectId) {
      throw new NotFoundException(`Vocabulary with ID ${id} for object ${objectId} not found`);
    }

    const prismaData: Prisma.VocabularyUpdateInput = {
      englishWord: updateDto.englishWord,
      vietnameseTranslation: updateDto.vietnameseTranslation,
      pronunciation: updateDto.pronunciation,
      audioUrl: updateDto.audioUrl,
      examples: updateDto.examples,
      targetPosition: updateDto.targetPosition,
    };

    return this.prisma.vocabulary.update({
      where: { id },
      data: prismaData,
      include: {
        object: true,
      },
    });
  }

  async remove(id: number, objectId: number): Promise<Vocabulary> {
    const vocabulary = await this.prisma.vocabulary.findUnique({
      where: { id },
    });
    if (!vocabulary || vocabulary.objectId !== objectId) {
      throw new NotFoundException(`Vocabulary with ID ${id} for object ${objectId} not found`);
    }
    return this.prisma.vocabulary.delete({
      where: { id },
      include: {
        object: true,
      },
    });
  }

  async markAsLearned(userId: string, vocabularyId: number): Promise<void> {
    await this.prisma.userVocabulary.upsert({
      where: {
        userId_vocabularyId: {
          userId,
          vocabularyId,
        },
      },
      update: {
        learned: true,
        lastReviewed: new Date(),
        proficiency: {
          increment: 1,
        },
      },
      create: {
        userId,
        vocabularyId,
        learned: true,
        lastReviewed: new Date(),
        proficiency: 1,
      },
    });
  }

  async getUserVocabulary(userId: string): Promise<any[]> {
    return this.prisma.userVocabulary.findMany({
      where: {
        userId,
      },
      include: {
        vocabulary: {
          include: {
            object: true,
          },
        },
      },
    });
  }

  async findByTheme(themeId: number): Promise<Vocabulary[]> {
    return this.prisma.vocabulary.findMany({
      where: {
        object: {
          themeId,
        },
      },
      include: {
        object: true,
      },
    });
  }

  // Cập nhật audioUrl cho các từ bị thiếu
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
