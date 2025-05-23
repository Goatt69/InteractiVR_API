import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ObjectsModule } from './modules/objects/objects.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { ThemeModule } from './modules/theme/theme.module';
import { VocabularyModule } from './modules/vocabulary/vocabulary.module';

import { LoggerMiddleware } from './common/middlewares';
import { HttpExceptionFilter } from './common/exceptions';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    ObjectsModule,
    ThemeModule,
    VocabularyModule,
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
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
