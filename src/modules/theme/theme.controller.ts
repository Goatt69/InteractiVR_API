import { JwtAuthGuard, Roles, RolesGuard } from './../../common/guards';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ThemeService } from './theme.service';
import { CreateThemeDto } from './dto/create-theme.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '../../common/constants';

@Controller('theme')
@ApiTags('theme')
export class ThemeController {
  constructor(private readonly themeService: ThemeService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new theme' })
  @ApiOkResponse({ description: 'Theme created successfully' })
  create(@Body() createThemeDto: CreateThemeDto) {
    return this.themeService.create(createThemeDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all themes' })
  @ApiOkResponse({ description: 'Themes retrieved successfully' })
  findAll() {
    return this.themeService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a theme by ID' })
  @ApiOkResponse({ description: 'Theme retrieved successfully' })
  findOne(@Param('id') id: string) {
    return this.themeService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a theme by ID' })
  @ApiOkResponse({ description: 'Theme updated successfully' })
  update(@Param('id') id: string, @Body() updateThemeDto: UpdateThemeDto) {
    return this.themeService.update(+id, updateThemeDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a theme by ID' })
  @ApiOkResponse({ description: 'Theme deleted successfully' })
  remove(@Param('id') id: string) {
    return this.themeService.remove(+id);
  }
}
