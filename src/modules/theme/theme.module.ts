import { Module } from '@nestjs/common';
import { ThemeService } from './theme.service';
import { ThemeController } from './theme.controller';
import { PrismaModule } from 'src/common/prisma';

@Module({
  controllers: [ThemeController],
  providers: [ThemeService],
  imports: [PrismaModule],
  exports: [ThemeService],
})
export class ThemeModule {}
