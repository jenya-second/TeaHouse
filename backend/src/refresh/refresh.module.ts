import { Module } from '@nestjs/common';
import { RefreshService } from './refresh.service';
import { SABYModule } from 'src/SABY/saby.module';
import { ScrapeModule } from 'src/web_scraping/scrape.module';
import { DatabaseModule } from 'src/database/db.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [
        SABYModule,
        ScrapeModule,
        DatabaseModule,
        ScheduleModule.forRoot(),
    ],
    providers: [RefreshService],
    exports: [RefreshService],
})
export class RefreshModule {}
