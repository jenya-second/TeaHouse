import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { SABYModule } from './SABY/saby.module';
import { ConfigModule } from '@nestjs/config';
import { ScrapeModule } from './web_scraping/scrape.module';
import { DatabaseModule } from './database/db.module';
import { RefreshModule } from './refresh/refresh.module';
import { TelegramBotModule } from './telegram/telegram.module';
import { TelegramAuthMiddleware } from './middleware/TelegramAuthMiddleware';

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
    controllers: [AppController],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(TelegramAuthMiddleware)
            .forRoutes({ path: '', method: RequestMethod.POST });
    }
}
