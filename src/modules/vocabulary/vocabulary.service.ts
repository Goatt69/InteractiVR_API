import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Vocabulary, Prisma } from '@prisma/client';

@Injectable()
export class VocabularyService {
  constructor(private prisma: PrismaService) {}

  // Lấy từ vựng theo ID của object 3D
  async findByObjectId(objectId: number): Promise<Vocabulary[]> {
    return this.prisma.vocabulary.findMany({
      where: {
        objectId: objectId,
      },
      include: {
        object: true, // Bao gồm thông tin về object
        objectParts: true, // Bao gồm thông tin về các phần của object
      },
    });
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

  // Lấy tất cả từ vựng
  async findAll(): Promise<Vocabulary[]> {
    return this.prisma.vocabulary.findMany({
      include: {
        object: true,
      },
    });
  }

  // Lấy từ vựng theo ID
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

  // Tạo từ vựng mới
  async create(data: Prisma.VocabularyCreateInput): Promise<Vocabulary> {
    return this.prisma.vocabulary.create({
      data,
      include: {
        object: true,
      },
    });
  }

  // Cập nhật từ vựng
  async update(id: number, data: Prisma.VocabularyUpdateInput): Promise<Vocabulary> {
    try {
      return await this.prisma.vocabulary.update({
        where: { id },
        data,
        include: {
          object: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Vocabulary with ID ${id} not found`);
        }
      }
      throw error;
    }
  }

  // Xóa từ vựng
  async remove(id: number): Promise<Vocabulary> {
    try {
      return await this.prisma.vocabulary.delete({
        where: { id },
        include: {
          object: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Vocabulary with ID ${id} not found`);
        }
      }
      throw error;
    }
  }

  // Đánh dấu từ vựng đã học cho người dùng
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

  // Lấy danh sách từ vựng đã học của người dùng
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

  // Lấy từ vựng theo theme
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
}