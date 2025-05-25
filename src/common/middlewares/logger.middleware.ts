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

    console.log(`\x1b[33mIncoming request: \x1b[32m${method} ${originalUrl}\x1b[0m`);
    console.log(`\x1b[33mUser: \x1b[34m${user?.email || 'Anonymous'}\x1b[0m`);
    console.log(`\x1b[33mTime: \x1b[36m${new Date().toISOString()}\x1b[0m`);
    console.log()
    });
  }
}
