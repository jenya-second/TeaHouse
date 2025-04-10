import { Controller, Get, Inject } from '@nestjs/common';
import { ScrapeService } from './scrape.service';
import { scrape_provider_name } from 'src/constants';

@Controller('scrape')
export class ScrapeController {
    constructor(
        @Inject(scrape_provider_name)
        private readonly scrapeService: ScrapeService,
    ) {}

    @Get()
    async getSalesPoints(): Promise<any> {
        return this.scrapeService.GetUsers();
    }
}
