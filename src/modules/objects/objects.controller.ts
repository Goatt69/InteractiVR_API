import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { ObjectsService } from './objects.service';
import { UpdateObjectDto } from './dto/update-object.dto';
import {
  ApiResponse,
  ApiOperation,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from 'src/common/constants';
import { Roles } from 'src/common/guards';
@Controller('objects')
@ApiTags('objects')
export class ObjectsController {
  constructor(private readonly objectsService: ObjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all objects' })
  @ApiResponse({ status: 200, description: 'Return all objects' })
  findAll() {
    return this.objectsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an object by ID' })
  @ApiOkResponse({ description: 'Object found successfully' })
  findOne(@Param('id') id: string) {
    return this.objectsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update an object by ID' })
  @ApiOkResponse({ description: 'Object updated successfully' })
  update(@Param('id') id: string, @Body() updateObjectDto: UpdateObjectDto) {
    return this.objectsService.update(+id, updateObjectDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete an object by ID' })
  @ApiOkResponse({ description: 'Object deleted successfully' })
  remove(@Param('id') id: string) {
    return this.objectsService.remove(+id);
  }
}
