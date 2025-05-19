import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { SABYService } from './saby.service';

@Controller('SABY')
export class SABYController {
    constructor(private readonly SABYService: SABYService) {}

    @Get()
    async getSalesPoints(): Promise<any> {
        //let prs : SABYPriceList[] = await this.SABYService.GetPriceLists();
        //return this.SABYService.GetPriceLists();
        const id = 'c165b6cd-7ac4-4da8-9a42-ea83f1f6df7b';
        // return [
        //     await this.SABYService.GetOrderInfo(id),
        //     await this.SABYService.GetOrderState(id),
        //     await this.SABYService.GetPaymentLink(id),
        // ];
        // return await this.SABYService.GetOrderInfo(id);
        // return this.SABYService.GetPaymentLink(id);
        return this.SABYService.GetOrderState(id);
        // return await this.SABYService.GetProductsFromPriceList('10');
        // return this.SABYService.CorrectAddress('Дубна, ул. Энтузиастов, 21');
        // return this.SABYService.GetOrders('2025-05-11 21:40:00', '2025-05-12 00:00:00');
    }
}
