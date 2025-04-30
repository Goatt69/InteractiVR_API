import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateThemeDto } from './dto/create-theme.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { Theme } from '@prisma/client';
import { PrismaService } from '../../common/prisma';

@Injectable()
export class ThemeService {
  constructor(private prisma: PrismaService) {}

  async create(createThemeDto: CreateThemeDto): Promise<Theme> {
    try {
      const existingTheme = await this.prisma.theme.findUnique({
        where: { name: createThemeDto.name },
      });
      if (existingTheme) {
        throw new ConflictException('Theme with this name already exists');
      }
      const theme = await this.prisma.theme.create({
        data: {
          ...createThemeDto,
        },
      });

      return theme;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error creating new theme');
    }
  }

  async findAll(): Promise<Theme[]> {
    const themes = await this.prisma.theme.findMany();
    return themes;
  }

  async findOne(id: number): Promise<Theme | null> {
    const theme = await this.prisma.theme.findUnique({
      where: { id },
    });
    return theme;
  }

  async update(id: number, updateThemeDto: UpdateThemeDto): Promise<Theme> {
    const theme = await this.prisma.theme.update({
      where: { id },
      data: { ...updateThemeDto },
    });
    return theme;
  }

  async remove(id: number): Promise<Theme> {
    const theme = await this.prisma.theme.delete({
      where: { id },
    });
    return theme;
  }
}
