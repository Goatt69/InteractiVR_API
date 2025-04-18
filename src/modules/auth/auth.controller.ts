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
import { UserLogin, userLoginSchema } from '../../common/schemas';
import { ZodValidationPipe } from '../../common/pipes';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/guards/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequestWithUser, UserRole } from '../../common/constants';
const LoginValidationPipe = new ZodValidationPipe(userLoginSchema);

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(LoginValidationPipe)
  async login(@Body() loginDto: UserLogin) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: RequestWithUser) {
    return req.user;
  }

  // For role-based access:
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin-only')
  adminEndpoint() {
    return { message: 'Admin access granted' };
  }
}
