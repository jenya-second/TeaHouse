import { Controller, Get } from '@nestjs/common';
import { SABYPriceList, SABYProduct } from '@tea-house/types';
import { SABYService } from './saby.service';

@Controller('SABY')
export class SABYController {
    constructor(private readonly SABYService: SABYService) {}

    @Get()
    async getSalesPoints(): Promise<string> {
        //let prs : SABYPriceList[] = await this.SABYService.GetPriceLists();
        //return this.SABYService.GetPriceLists();
        const id = '4daaae22-5db4-4627-a445-cde38c4c0bb0';
        // return [
        //     await this.SABYService.GetOrderInfo(id),
        //     await this.SABYService.GetOrderState(id),
        //     await this.SABYService.GetPaymentLink(id),
        // ];
        return await this.SABYService.GetOrderInfo(id);
    }
}
