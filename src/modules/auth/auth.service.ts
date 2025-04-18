import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  JwtPayload,
  LoginResponse,
  UserWithoutPassword,
  UserRole,
} from '../../common/constants';
import { LoginUserDto } from '../users/dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserWithoutPassword | null> {
    const user = await this.usersService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result as UserWithoutPassword;
    }

    return null;
  }

  async login(userLoginDto: LoginUserDto): Promise<LoginResponse> {
    const user = await this.validateUser(
      userLoginDto.email,
      userLoginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      role: user.role as UserRole,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
