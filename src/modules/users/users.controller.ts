import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  UpdateUserDto,
  CreateUserValidationPipe,
  UpdateUserValidationPipe,
} from './dto';
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Roles, JwtAuthGuard, RolesGuard } from '../../common/guards';
import { UserRole } from '../../common/constants';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @UsePipes(CreateUserValidationPipe)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiOkResponse({ description: 'User registered successfully' })
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ description: 'Users found successfully' })
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':uuid')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get a user by UUID' })
  @ApiOkResponse({ description: 'User found successfully' })
  @ApiBearerAuth()
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.usersService.findOne(uuid);
  }

  @Patch(':uuid')
  @UsePipes(UpdateUserValidationPipe)
  @ApiOperation({ summary: 'Update a user by UUID' })
  @ApiOkResponse({ description: 'User updated successfully' })
  @ApiBearerAuth()
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(uuid, updateUserDto);
  }

  @Delete(':uuid')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a user by UUID' })
  @ApiOkResponse({ description: 'User deleted successfully' })
  @ApiBearerAuth()
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.usersService.remove(uuid);
  }
}
