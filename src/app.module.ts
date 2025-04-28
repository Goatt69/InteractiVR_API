import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ObjectsModule } from './modules/objects/objects.module';
import { PrismaModule } from './common/prisma/prisma.module';

import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { AuthMiddleware } from './common/middlewares/auth.middleware';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    ObjectsModule,
    ConfigModule.forRoot(),
    SentryModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthMiddleware,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware, AuthMiddleware).forRoutes('*');
  }
}
