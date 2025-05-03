import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from '../constants';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;

    next();

    res.on('finish', () => {
      const user = req.user as JwtPayload

    console.log(`Incoming request: ${method} ${originalUrl}`);
    console.log(`User: ${user?.email || 'Anonymous'}`);
    });
  }
}
