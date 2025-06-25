import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { PublicController } from './public.controller';
import { SABYModule } from './SABY/saby.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/db.module';
import { RefreshModule } from './refresh/refresh.module';
import { TelegramBotModule } from './telegram/telegram.module';
import { TelegramAuthMiddleware } from './middleware/TelegramAuthMiddleware';
import { AuthController } from './auth.controller';

@Module({
    imports: [
        DatabaseModule,
        RefreshModule,
        SABYModule,
        TelegramBotModule,
        ConfigModule.forRoot({
            envFilePath: 'dist/env/.env',
            isGlobal: true,
        }),
    ],
    controllers: [PublicController, AuthController],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(TelegramAuthMiddleware).forRoutes(AuthController);
    }
}
