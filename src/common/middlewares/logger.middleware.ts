import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from '@prisma/client';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const user = req.user as User;
    console.log(`Incoming request: ${method} ${originalUrl}`);
    console.log(`User: ${user?.email}`);
    next();
  }
}
