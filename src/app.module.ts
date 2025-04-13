import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SentryModule } from '@sentry/nestjs/setup';
import { APP_FILTER } from "@nestjs/core";
import { SentryGlobalFilter } from '@sentry/nestjs/setup';
@Module({
  imports: [
    UsersModule,
    SentryModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
})
export class AppModule {}
