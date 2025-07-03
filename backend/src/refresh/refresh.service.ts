import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SABYProduct } from '@tea-house/types';
import { scrape_provider_name } from 'src/constants';
import {
    Client,
    Order,
    Product,
    SaleNomenclature,
    TeaDiary,
} from 'src/database/entities';
import {
    CategoryService,
    ClientService,
    ImageService,
    OrderService,
    ProductService,
    SaleNomenclatureService,
    TeaDiaryService,
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
        private readonly teaDiaryService: TeaDiaryService,
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
        const [orders, saleNomenclatures, teaDiary] =
            await this.GetRefreshedOrders();
        await this.orderService.updateOrders(orders);
        await this.saleNomenclaturesService.updateSaleNomenclatures(
            saleNomenclatures,
        );
        await this.teaDiaryService.updateTeaDiary(teaDiary);
        console.log('Refreshed ' + new Date());
    }

    async GetRefreshedOrders(
        date?: string,
    ): Promise<[Order[], SaleNomenclature[], TeaDiary[]]> {
        const [start, end] = date ? this.GetDays(date) : this.GetTodays();
        const orders: Order[] = [];
        const saleNomenclatures: SaleNomenclature[] = [];
        let sabyorders = await this.SABYService.GetOrders(start, end);
        const todayOrders = await this.orderService.getByDay(
            `${start.split(' ')[0]}%`,
        );
        sabyorders = sabyorders.filter(
            (val) =>
                !val.Deleted &&
                val.Customer &&
                !todayOrders.find((t) => t.key == val.Key),
        );
        const clients = await this.clientService.findAll();
        const products = await this.productService.getAll();
        const tea =
            await this.categoryService.findProductsByCategoryName('Чай_');
        const teaDiary: TeaDiary[] = [];
        for (let i = 0; i < sabyorders.length; i++) {
            const val = sabyorders[i];
            const newOrder = new Order(val);
            newOrder.client = clients.find((c) => c.num == val.Customer);
            for (let j = 0; j < val.SaleNomenclatures.length; j++) {
                const nom = val.SaleNomenclatures[j];
                const salenom = new SaleNomenclature(nom);
                salenom.order = newOrder;
                salenom.product = products.find(
                    (p) => p.nomNumber == nom.NomenclatureNumber,
                );
                if (!salenom.product) continue;
                saleNomenclatures.push(salenom);
                if (tea.find((val) => salenom.product.id == val.id)) {
                    teaDiary.push({
                        product: salenom.product,
                        client: newOrder.client,
                        id: undefined,
                        impression: '',
                        taste: '',
                        smell: '',
                        afterstate: '',
                        rank: 0,
                    });
                }
            }
            orders.push(newOrder);
        }
        return [orders, saleNomenclatures, teaDiary];
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
        const [orders, saleNomenclatures, teaDiary] =
            await this.GetRefreshedOrders(date);
        await this.orderService.updateOrders(orders);
        await this.saleNomenclaturesService.updateSaleNomenclatures(
            saleNomenclatures,
        );
        await this.teaDiaryService.updateTeaDiary(teaDiary);
    }
}
