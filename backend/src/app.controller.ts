import { Controller, Get, Inject, Param, StreamableFile } from '@nestjs/common';
import { AppService } from './app.service';
import { createReadStream } from 'fs';
import { join } from 'path';
import { SABYProduct } from '@tea-house/types';
import { SABYService } from './SABY/saby.service';
import {
    CategoryService,
    ClientService,
    ImageService,
    OrderService,
    ProductService,
    SaleNomenclatureService,
} from './database/services';
import {
    Category,
    Product,
    Image,
    Client,
    Order,
    SaleNomenclature,
} from './database/entities';
import { ScrapeService } from './web_scraping/scrape.service';
import { scrape_provider_name } from './constants';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
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

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Get('image/:id')
    getImage(@Param('id') id: number): StreamableFile {
        const file = createReadStream(
            join(process.cwd(), `dl_image/${id}.jpeg`),
        );
        return new StreamableFile(file, {
            type: 'image/jpeg',
        });
    }

    @Get('all')
    async getProducts(): Promise<Category[]> {
        //return this.productService.findAll();
        return this.categoryService.findAll();
    }

    @Get('client')
    async saveClients(): Promise<Client[]> {
        const clients: Client[] = await this.scrapeService.GetUsers();
        return this.clientService.saveMany(clients);
    }

    @Get('save')
    async saveProducts() {
        const SABYproducts: SABYProduct[] =
            await this.SABYService.GetProductsFromPriceList('10');
        let images: Image[] = [];
        let products: Product[] = [];
        let categories: Category[] = [];
        [images, products, categories] =
            this.productService.parceList(SABYproducts);
        return (
            'Saved ' +
            (await this.categoryService.saveMany(categories)).length +
            ' categories;\n' +
            'Saved ' +
            (await this.productService.saveMany(products)).length +
            ' products;\n' +
            'Saved ' +
            (await this.imageService.saveMany(images)).length +
            ' images;\n' +
            (await this.imageService.reloadImages())
        );
    }

    @Get('orders/save')
    async saveOrders() {
        const start =
            new Date(2025, 3, 11).toISOString().split('T')[0] + ' 00:00:00';
        const end =
            new Date(2025, 3, 12).toISOString().split('T')[0] + ' 00:00:00';
        const orders: Order[] = [];
        const saleNomenclature: SaleNomenclature[] = [];
        const sabyorders = await this.SABYService.GetOrders(start, end);
        sabyorders.forEach((val) => {
            if (val.Deleted) return;
            // if (!val.Customer) return;
            const newOrder = new Order(val);
            // newOrder.client = ;
            val.SaleNomenclatures.forEach((nom) => {
                const salenom = new SaleNomenclature(nom);
                salenom.order = newOrder;
                saleNomenclature.push(salenom);
            });
            orders.push(newOrder);
        });
        await this.orderService.saveMany(orders);
        await this.saleNomenclaturesService.saveMany(saleNomenclature);
    }

    @Get('del')
    async delAll() {
        this.categoryService.deleteAll();
        return this.productService.deleteAll();
    }

    @Get('img')
    async saveImg() {
        return this.imageService.reloadImages();
    }
}
