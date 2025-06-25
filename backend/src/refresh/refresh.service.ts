import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SABYProduct } from '@tea-house/types';
import { scrape_provider_name } from 'src/constants';
import { Order, SaleNomenclature } from 'src/database/entities';
import {
    CategoryService,
    ClientService,
    ImageService,
    OrderService,
    ProductService,
    SaleNomenclatureService,
} from 'src/database/services';
import { SABYService } from 'src/SABY/saby.service';
import { ScrapeService } from 'src/web_scraping/scrape.service';

@Injectable()
export class RefreshService {
    constructor(
        private readonly productService: ProductService,
        private readonly SABYService: SABYService,
        private readonly imageService: ImageService,
        private readonly categoryService: CategoryService,
        private readonly clientService: ClientService,
        private readonly orderService: OrderService,
        private readonly saleNomenclaturesService: SaleNomenclatureService,
        @Inject(scrape_provider_name)
        private readonly scrapeService: ScrapeService,
    ) {}

    @Cron('00 */10 * * * *')
    async RefreshDataBase() {
        if (this.scrapeService) {
            await this.clientService.updateClients(
                await this.scrapeService.GetUsers(),
            );
        }
        const SABYproducts: SABYProduct[] =
            await this.SABYService.GetProductsFromPriceList('10');
        const [images, products, categories] =
            this.productService.parceList(SABYproducts);
        await this.categoryService.updateCategoties(categories);
        await this.productService.updateProducts(products);
        await this.imageService.updateImages(images);
        const [orders, saleNomenclatures] = await this.GetRefreshedOrders();
        await this.orderService.updateOrders(orders);
        await this.saleNomenclaturesService.updateSaleNomenclatures(
            saleNomenclatures,
        );
        console.log('Refreshed ' + new Date());
    }

    async GetRefreshedOrders(
        date?: string,
    ): Promise<[Order[], SaleNomenclature[]]> {
        const [start, end] = date ? this.GetDays(date) : this.GetTodays();
        const orders: Order[] = [];
        const saleNomenclatures: SaleNomenclature[] = [];
        const sabyorders = await this.SABYService.GetOrders(start, end);
        for (let i = 0; i < sabyorders.length; i++) {
            const val = sabyorders[i];
            if (val.Deleted) continue;
            if (!val.Customer) continue;
            const newOrder = new Order(val);
            newOrder.client = await this.clientService.findByCustomerId(
                val.Customer,
            );
            for (let j = 0; j < val.SaleNomenclatures.length; j++) {
                const nom = val.SaleNomenclatures[j];
                const salenom = new SaleNomenclature(nom);
                salenom.order = newOrder;
                salenom.product = await this.productService.findByNomNumber(
                    nom.NomenclatureNumber,
                );
                saleNomenclatures.push(salenom);
            }
            orders.push(newOrder);
        }
        return [orders, saleNomenclatures];
    }

    GetTodays(): [string, string] {
        const actual = new Date();
        const start = actual.toISOString().split('T')[0] + ' 00:00:00';
        actual.setDate(actual.getDate() + 1);
        const end = actual.toISOString().split('T')[0] + ' 00:00:00';
        return [start, end];
    }

    GetDays(date: string): [string, string] {
        const actual = new Date(date); //'2025-05-17'
        const start = actual.toISOString().split('T')[0] + ' 00:00:00';
        actual.setDate(actual.getDate() + 1);
        const end = actual.toISOString().split('T')[0] + ' 00:00:00';
        return [start, end];
    }

    async RefreshDay(date: string) {
        const [orders, saleNomenclatures] = await this.GetRefreshedOrders(date);
        await this.orderService.updateOrders(orders);
        await this.saleNomenclaturesService.updateSaleNomenclatures(
            saleNomenclatures,
        );
    }
}
