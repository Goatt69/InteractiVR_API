import { JwtAuthGuard, Roles, RolesGuard } from './../../common/guards';
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
  UseGuards,
} from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { UserRole } from '../../common/constants';

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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new vocabulary item for an object' })
  @ApiParam({ name: 'objectId', type: 'number' })
  @ApiBody({ type: CreateVocabularyDto, description: 'Vocabulary data' })
  @UsePipes(new ValidationPipe({ transform: true }))
  create(
    @Param('objectId', ParseIntPipe) objectId: number,
    @Body() createVocabularyDto: CreateVocabularyDto
  ) {
    return this.vocabularyService.create({ ...createVocabularyDto, objectId });
  }

  @Patch('object/:objectId/vocabulary/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a vocabulary item for an object' })
  @ApiParam({ name: 'objectId', type: 'number' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ type: UpdateVocabularyDto, description: 'Updated vocabulary data' })
  //@UsePipes(UpdateVocabularyPipe)
  update(
    @Param('objectId', ParseIntPipe) objectId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVocabularyDto: UpdateVocabularyDto,
  ) {
    return this.vocabularyService.update(id, objectId, updateVocabularyDto);
  }

  @Delete('object/:objectId/vocabulary/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a vocabulary item for an object' })
  @ApiParam({ name: 'id', type: 'number' })
  remove(
    @Param('id', ParseIntPipe) id: number,) {
    return this.vocabularyService.remove(id);
  }
}