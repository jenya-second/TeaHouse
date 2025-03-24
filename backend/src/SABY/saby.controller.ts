import { Controller, Get } from '@nestjs/common';
import { SABYPriceList, SABYProduct } from '@tea-house/types';
import { SABYService } from './saby.service';

@Controller('SABY')
export class SABYController {
    constructor(private readonly SABYService: SABYService) {}

    @Get()
    async getSalesPoints(): Promise<SABYProduct[]> {
        //let prs : SABYPriceList[] = await this.SABYService.GetPriceLists();
        //return this.SABYService.GetPriceLists();
        return this.SABYService.GetProductsFromPriceList('10');
    }
}
