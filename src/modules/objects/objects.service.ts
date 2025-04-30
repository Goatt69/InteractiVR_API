import { Injectable } from '@nestjs/common';
import { UpdateObjectDto } from './dto/update-object.dto';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ObjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const objects = await this.prisma.object.findMany();
    return objects;
  }

  async findOne(id: number) {
    return await this.prisma.object.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateObjectDto: UpdateObjectDto) {
    return await this.prisma.object.update({
      where: { id },
      data: updateObjectDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.object.delete({
      where: { id },
    });
  }
}
