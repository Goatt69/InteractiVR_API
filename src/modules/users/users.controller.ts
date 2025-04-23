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
import { ApiTags } from '@nestjs/swagger';
import { Roles, JwtAuthGuard, RolesGuard } from '../../common/guards';
import { UserRole } from '../../common/constants';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @UsePipes(CreateUserValidationPipe)
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':uuid')
  @Roles(UserRole.ADMIN)
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.usersService.findOne(uuid);
  }

  @Patch(':uuid')
  @UsePipes(UpdateUserValidationPipe)
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(uuid, updateUserDto);
  }

  @Delete(':uuid')
  @Roles(UserRole.ADMIN)
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.usersService.remove(uuid);
  }
}
