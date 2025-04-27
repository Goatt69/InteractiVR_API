import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { ObjectsService } from './objects.service';
import { UpdateObjectDto } from './dto/update-object.dto';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';

@Controller('objects')
export class ObjectsController {
  constructor(private readonly objectsService: ObjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all objects' })
  @ApiResponse({ status: 200, description: 'Return all objects' })
  findAll() {
    return this.objectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.objectsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateObjectDto: UpdateObjectDto) {
    return this.objectsService.update(+id, updateObjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.objectsService.remove(+id);
  }
}
