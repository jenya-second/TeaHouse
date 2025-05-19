import { Module } from '@nestjs/common';
import { ScrapeController } from './scrape.controller';
import { ScrapeService } from './scrape.service';
import { scrape_provider_name } from 'src/constants';

@Module({
    controllers: [ScrapeController],
    providers: [
        {
            provide: scrape_provider_name,
            useFactory: async () => {
                // const service: ScrapeService = new ScrapeService();
                // return await service.init();
            },
        },
    ],
    exports: [scrape_provider_name],
})
export class ScrapeModule {}
