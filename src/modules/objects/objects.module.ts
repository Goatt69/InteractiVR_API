import { Module } from '@nestjs/common';
import { ObjectsService } from './objects.service';
import { ObjectsController } from './objects.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  controllers: [ObjectsController],
  providers: [ObjectsService],
  imports: [PrismaModule],
  exports: [ObjectsService],
})
export class ObjectsModule {}
