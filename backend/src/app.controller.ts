import {
    Body,
    Controller,
    Get,
    Inject,
    Param,
    Post,
    StreamableFile,
    Request,
} from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import {
    CategoryService,
    ClientService,
    ImageService,
    OrderInProgressService,
    OrderService,
    ProductService,
    SaleNomenclatureService,
    TelegramUserService,
} from './database/services';
import { Category, OrderInProgress, Product } from './database/entities';
import { RefreshService } from './refresh/refresh.service';
import { SABYService } from './SABY/saby.service';
import { SABYDelivery, SABYOrderInProgress } from '@tea-house/types';
import { Request as ExpRequest } from 'express';

interface Delivery {
    client: {
        phone: string;
        name: string;
        surname: string;
        lastname: string;
    };
    isPickup: boolean;
    nomenclatures: {
        nomNumber: string;
        count: number;
    }[];
    delivery: {
        address: string;
        comment: string;
    };
}

@Controller()
export class AppController {
    constructor(
        private readonly productService: ProductService,
        private readonly telegramUserService: TelegramUserService,
        private readonly orderInProgressService: OrderInProgressService,
        private readonly categoryService: CategoryService,
        private readonly refreshService: RefreshService,
        private readonly SABYService: SABYService,
    ) {}

    @Get()
    doSmt() {
        return this.refreshService.RefreshDataBase();
        // return 'aboba';
    }

    @Post()
    async postNewOrder(@Request() req: ExpRequest) {
        const deliveryData: Delivery = req.body.deliveryData;
        const actual = new Date();
        const initData = new URLSearchParams(req.body.initData);
        const userId = JSON.parse(initData.get('user')).id;
        const phone = (await this.telegramUserService.findOneByTgId(userId))
            .phone;
        actual.setFullYear(actual.getFullYear() + 1);
        const delivery: SABYDelivery = {
            customer: {
                name: deliveryData.client.name,
                lastname: deliveryData.client.lastname,
                patronymic: deliveryData.client.surname,
                phone: phone,
            },
            datetime: actual.toISOString().split('T')[0] + ' 00:00:00',
            delivery: {
                isPickup: deliveryData.isPickup,
                paymentType: 'online',
                successURL: 'https://oichaitemp.maslo-spb.ru/',
                errorURL: 'https://oichaitemp.maslo-spb.ru/',
                shopURL: 'https://oichaitemp.maslo-spb.ru/',
            },
            nomenclatures: deliveryData.nomenclatures.map((val) => {
                return {
                    nomNumber: val.nomNumber,
                    count: val.count,
                    priceListId: 10,
                };
            }),
            pointId: 244,
            product: 'delivery',
        };
        if (!deliveryData.isPickup) {
            const addreses: any[] = (
                await this.SABYService.CorrectAddress(
                    deliveryData.delivery.address,
                )
            ).addresses;
            const addressJSON = !addreses ? {} : addreses[0].addressJSON;
            const addressFull = !addreses
                ? deliveryData.delivery.address
                : addreses[0].addressJSON;
            delivery.delivery.addressFull = addressFull;
            delivery.delivery.addressJSON = addressJSON;
        }
        if (deliveryData.delivery.comment) {
            delivery.comment = deliveryData.delivery.comment;
        }
        const orderInProgress: SABYOrderInProgress =
            await this.SABYService.CreateOrder(delivery);
        return this.orderInProgressService.insertOrderFromSABYOrder(
            orderInProgress,
            10,
        );
    }

    @Post('updateOrder')
    async infoFromSABY(@Request() req: ExpRequest) {
        const orderKey: string = JSON.parse(req.body.data).Sales[0].id;
        let orderInfo: SABYOrderInProgress = undefined;
        try {
            orderInfo = await this.SABYService.GetOrderInfo(orderKey);
        } catch (e) {
            return;
        }
        const orderState: { state: number; payState: number } =
            await this.SABYService.GetOrderState(orderKey);
        if (orderState.state == 220) {
            this.orderInProgressService.deleteByKey(orderInfo.key);
            return;
        }
        if (orderState.state >= 21 && orderState.state <= 91) {
            this.orderInProgressService.insertOrderFromSABYOrder(
                orderInfo,
                orderState.state,
            ); //под вопросом
            //уведомление об оплате приходит 2 раза?
            console.log(orderInfo);
            console.log(orderState);
        }
        if (orderState.state == 200) {
            this.orderInProgressService.deleteByKey(orderInfo.key);
            return;
            //нужно ли регать чек???
        }
    }

    @Get('image/:id')
    getImage(@Param('id') id: number): StreamableFile {
        const file = createReadStream(
            join(process.cwd(), `./dl_image/${id}.jpeg`),
        );
        return new StreamableFile(file, {
            type: 'image/jpeg',
        });
    }

    @Get('product')
    async getProducts(): Promise<Category[]> {
        return this.categoryService.findAll();
    }

    @Get('product/:id')
    async getProductById(@Param('id') id: number): Promise<Product> {
        return this.productService.findById(id);
    }
}
