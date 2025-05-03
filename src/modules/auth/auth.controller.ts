import {
  Controller,
  Post,
  Body,
  UsePipes,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { userLoginSchema } from '../../common/schemas';
import { ZodValidationPipe } from '../../common/pipes';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Roles, JwtAuthGuard, RolesGuard } from '../../common/guards';
import { RequestWithUser, UserRole } from '../../common/constants';
import { LoginUserDto } from '../users/dto';

const LoginValidationPipe = new ZodValidationPipe(userLoginSchema);

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(LoginValidationPipe)
  async login(@Body() loginDto: LoginUserDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  getProfile(@Request() req: RequestWithUser) {
    return req.user;
  }

  // For role-based access:
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Get('admin-only')
  adminEndpoint() {
    return { message: 'Admin access granted' };
  }
}
