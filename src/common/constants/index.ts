import { User } from '@prisma/client';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface JwtPayload {
  email: string;
  sub: string;
  role: UserRole;
}

export type UserWithoutPassword = Omit<User, 'password'>;
export interface LoginResponse {
  access_token: string;
  user: UserWithoutPassword;
}

export interface RequestUser {
  id: string;
  email: string;
  role: string;
}

export interface RequestWithUser extends Request {
  user: RequestUser;
}
