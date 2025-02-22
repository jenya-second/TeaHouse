import { Controller, Get } from '@nestjs/common';
import SABYProduct from 'src/types/SABYProduct';
import { SABYService } from './saby.service';

@Controller('SABY')
export class SABYController {
  constructor(private readonly SABYService: SABYService) {}

  @Get()
  async getSalesPoints(): Promise<SABYProduct[]> {
    //let prs : SABYPriceList[] = await this.SABYService.GetPriceLists();
    return this.SABYService.GetProductsFromPriceList('10');
  }
}