import {
    Controller,
    Get,
    Param,
    Post,
    Request,
    Inject,
    Res,
} from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';
import {
    CategoryService,
    OrderInProgressService,
    OrderService,
    ProductService,
    TelegramUserService,
} from './database/services';
import { Category, Product } from './database/entities';
import { RefreshService } from './refresh/refresh.service';
import { SABYService } from './SABY/saby.service';
import { SABYOrderInProgress } from '@tea-house/types';
import { Request as ExpRequest, Response } from 'express';
import { OichaiBot } from './telegram/telegram.bot';
import { telegram_bot } from './constants';
import Sharp from 'sharp';

@Controller()
export class PublicController {
    constructor(
        private readonly productService: ProductService,
        private readonly orderInProgressService: OrderInProgressService,
        private readonly categoryService: CategoryService,
        private readonly SABYService: SABYService,
        private readonly telegramUserService: TelegramUserService,
        @Inject(telegram_bot)
        private readonly telegramBot: OichaiBot,
    ) {}

    @Get()
    doSmt() {
        return 'aboba';
    }

    // @Get('date/:date')
    // refreshOrderByDate(@Param('date') date: string) {
    //     return this.refreshService.RefreshDay(date);
    // }

    @Get('image/:id/:q?')
    async getImage(
        @Param('id') id: number,
        @Param('q') q: number,
        @Res() res: Response,
    ) {
        const path = join(process.cwd(), `./dl_image/${id}.jpeg`);
        if (!existsSync(path)) return res.end();
        const file = Sharp(path)
            .resize(q ? 250 : 600)
            .png({ force: true, quality: q ? 70 : 100 });
        res.setHeader('Cache-Control', 'max-age=600');
        file.pipe(res);
    }

    @Get('product')
    async getProducts(): Promise<Category[]> {
        const categories = await this.categoryService.findAll();
        for (let i = 0; i < categories.length; i++) {
            categories[i].products = categories[i].products.filter(
                (val) => val.published,
            );
        }
        return categories;
    }

    @Get('product/:id')
    async getProductById(@Param('id') id: number): Promise<Product> {
        return this.productService.findById(id);
    }

    @Post('updateOrder')
    async infoFromSABY(@Request() req: ExpRequest) {
        const authString = req.headers.authorization?.split(' ')[1];
        const [name, password] = atob(authString).split(':');
        if (
            name != process.env.WEBHOOK_USER ||
            password != process.env.WEBHOOK_PASSWORD
        )
            return;
        const orderKey: string = JSON.parse(req.body.data).Sales[0].id;
        let orderInfo: SABYOrderInProgress = undefined;
        try {
            orderInfo = await this.SABYService.GetOrderInfo(orderKey);
        } catch (e) {
            return;
        }
        const orderState = await this.SABYService.GetOrderState(orderKey);
        if (orderState.state == 220 || orderState.state == 200) {
            this.orderInProgressService.deleteByKeys([orderInfo.key]);
            return;
        }
        if (orderState.state >= 21 && orderState.state <= 91) {
            if (orderState.payments[0]?.id) {
                if (orderState.payments[0].isClosed) {
                    this.orderInProgressService.setPayStateByKey(
                        orderInfo.key,
                        'fulfilled',
                    );
                    const date = orderInfo.datetime.split(' ')[0];
                    const tgUser = await this.telegramUserService.findByPhone(
                        orderInfo.customer.phone,
                    );
                    const text = `Оплачен заказ от ${date[2]}-${date[1]}-${+date[0] - 1} от клиента ${orderInfo.customer.name} @${tgUser?.username ?? ''}`;
                    this.telegramBot.SendMessageToUser(
                        text,
                        process.env.JENYA_CHAT_id,
                    );
                    this.telegramBot.SendMessageToUser(
                        text,
                        process.env.DIMA_CHAT_id,
                    );
                } else {
                    this.orderInProgressService.setPayStateByKey(
                        orderInfo.key,
                        'processing',
                    );
                }
                return;
            }
            const orders =
                await this.orderInProgressService.getAllByKey(orderKey);
            if (orders.find((val) => val.state == orderState.state)) return;
            await this.orderInProgressService.insertOrderFromSABYOrder(
                orderInfo,
                orderState.state,
            );
            this.telegramBot.SendMessageAboutOrder(orders[0]);
        }
    }
}
