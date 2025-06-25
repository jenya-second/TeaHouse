import {
    Controller,
    Get,
    Param,
    Post,
    StreamableFile,
    Request,
    Inject,
    Res,
} from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import {
    CategoryService,
    OrderInProgressService,
    ProductService,
} from './database/services';
import { Category, OrderInProgress, Product } from './database/entities';
import { RefreshService } from './refresh/refresh.service';
import { SABYService } from './SABY/saby.service';
import { SABYOrderInProgress } from '@tea-house/types';
import { Request as ExpRequest, Response } from 'express';
import { OichaiBot } from './telegram/telegram.bot';
import { telegram_bot } from './constants';

@Controller()
export class PublicController {
    constructor(
        private readonly productService: ProductService,
        private readonly orderInProgressService: OrderInProgressService,
        private readonly categoryService: CategoryService,
        private readonly refreshService: RefreshService,
        private readonly SABYService: SABYService,
        @Inject(telegram_bot)
        private readonly telegramBot: OichaiBot,
    ) {}

    @Get()
    doSmt() {
        // return this.refreshService.RefreshDataBase();
        // return this.orderInProgressService.getAllByKey('bbd645ae-401f-4a20-8dba-f7995f6af4fe');
        return 'aboba';
    }

    // @Get(':date')
    // refreshOrderByDate(@Param('date') date: string) {
    //     return this.refreshService.RefreshDay(date);
    // }

    @Get('image/:id')
    getImage(@Param('id') id: number, @Res() res: Response) {
        const file = createReadStream(
            join(process.cwd(), `./dl_image/${id}.jpeg`),
        );
        res.setHeader('Cache-Control', 'max-age=600');
        file.pipe(res);
        // return new StreamableFile(file, {
        //     type: 'image/jpeg',
        // });
    }

    @Get('product')
    async getProducts(): Promise<Category[]> {
        return this.categoryService.findAll();
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
            console.log(orderInfo);
            console.log(orderState);
            if (orderState.payments[0]?.id) {
                if (orderState.payments[0].isClosed) {
                    this.orderInProgressService.setPayStateByKey(
                        orderInfo.key,
                        'fulfilled',
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
            this.telegramBot.SendMessageToUser(orders[0]);
        }
    }
}
