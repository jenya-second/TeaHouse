import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SABYModule } from './SABY/saby.module';
import { ConfigModule } from '@nestjs/config';
import { ScrapeModule } from './web_scraping/scrape.module';
import { DatabaseModule } from './database/db.module';

@Module({
    imports: [
        SABYModule,
        ScrapeModule,
        DatabaseModule,
        ConfigModule.forRoot({
            envFilePath: 'dist/env/.env',
            isGlobal: true,
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
