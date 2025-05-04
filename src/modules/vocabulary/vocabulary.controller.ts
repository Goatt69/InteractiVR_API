import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RequestWithUser } from '../../common/constants';

@Controller('vocabulary')
@ApiTags('vocabulary')
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @Get('object/:objectId')
  @ApiOperation({ summary: 'Get vocabulary by object ID' })
  @ApiParam({ name: 'objectId', type: 'number' })
  findByObjectId(@Param('objectId', ParseIntPipe) objectId: number) {
    return this.vocabularyService.findByObjectId(objectId);
  }

  @Get('theme/:themeId/object/:identifier')
  @ApiOperation({ summary: 'Get vocabulary by object identifier and theme ID' })
  findByObjectIdentifier(
    @Param('identifier') identifier: string,
    @Param('themeId', ParseIntPipe) themeId: number,
  ) {
    return this.vocabularyService.findByObjectIdentifier(identifier, themeId);
  }

  @Get('theme/:themeId')
  @ApiOperation({ summary: 'Get vocabulary by theme ID' })
  @ApiParam({ name: 'themeId', type: 'number' })
  findByTheme(@Param('themeId', ParseIntPipe) themeId: number) {
    return this.vocabularyService.findByTheme(themeId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vocabulary items' })
  findAll() {
    return this.vocabularyService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vocabulary by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vocabularyService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new vocabulary item' })
  @ApiBody({ description: 'Vocabulary data' })
  create(@Body() createVocabularyDto: Prisma.VocabularyCreateInput) {
    return this.vocabularyService.create(createVocabularyDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a vocabulary item' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ description: 'Updated vocabulary data' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVocabularyDto: Prisma.VocabularyUpdateInput,
  ) {
    return this.vocabularyService.update(id, updateVocabularyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a vocabulary item' })
  @ApiParam({ name: 'id', type: 'number' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vocabularyService.remove(id);
  }

  @Post(':id/learn')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Mark vocabulary as learned' })
  @ApiParam({ name: 'id', type: 'number' })
  markAsLearned(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: RequestWithUser,
  ) {
    return this.vocabularyService.markAsLearned(req.user.id, id);
  }

  @Get('user/learned')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user vocabulary progress' })
  getUserVocabulary(@Request() req: RequestWithUser) {
    return this.vocabularyService.getUserVocabulary(req.user.id);
  }
}
