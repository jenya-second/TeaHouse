import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SABYModule } from './SABY/saby.module';
import { ConfigModule } from '@nestjs/config';
import { ScrapeModule } from './web_scraping/scrape.module';
import { DatabaseModule } from './database/db.module';
import { RefreshModule } from './refresh/refresh.module';

@Module({
    imports: [
        DatabaseModule,
        RefreshModule,
        ConfigModule.forRoot({
            envFilePath: 'dist/env/.env',
            isGlobal: true,
        }),
    ],
    controllers: [AppController],
})
export class AppModule {}
