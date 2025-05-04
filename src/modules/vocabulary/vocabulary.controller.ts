import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateVocabularyDto, UpdateVocabularyDto } from './dto/vocabulary.dto';

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

  @Post('object/:objectId')
  @ApiOperation({ summary: 'Create a new vocabulary item for an object' })
  @ApiParam({ name: 'objectId', type: 'number' })
  @ApiBody({ type: CreateVocabularyDto, description: 'Vocabulary data' })
  @UsePipes(new ValidationPipe({ transform: true }))
  create(
    @Param('objectId', ParseIntPipe) objectId: number,
    @Body() createVocabularyDto: CreateVocabularyDto,
  ) {
    // Ensure the objectId in the DTO matches the URL parameter
    createVocabularyDto.objectId = objectId;
    return this.vocabularyService.create(createVocabularyDto);
  }

  @Patch('object/:objectId/vocabulary/:id')
  @ApiOperation({ summary: 'Update a vocabulary item for an object' })
  @ApiParam({ name: 'objectId', type: 'number' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ type: UpdateVocabularyDto, description: 'Updated vocabulary data' })
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Param('objectId', ParseIntPipe) objectId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVocabularyDto: UpdateVocabularyDto,
  ) {
    return this.vocabularyService.update(id, objectId, updateVocabularyDto);
  }

  @Delete('object/:objectId/vocabulary/:id')
  @ApiOperation({ summary: 'Delete a vocabulary item for an object' })
  @ApiParam({ name: 'objectId', type: 'number' })
  @ApiParam({ name: 'id', type: 'number' })
  remove(
    @Param('objectId', ParseIntPipe) objectId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.vocabularyService.remove(id, objectId);
  }

  @Get('theme/:themeId')
  @ApiOperation({ summary: 'Get vocabulary by theme ID' })
  @ApiParam({ name: 'themeId', type: 'number' })
  findByTheme(@Param('themeId', ParseIntPipe) themeId: number) {
    return this.vocabularyService.findByTheme(themeId);
  }
}