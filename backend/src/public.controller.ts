import {
    Controller,
    Get,
    Param,
    Post,
    StreamableFile,
    Request,
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
import { Request as ExpRequest } from 'express';

@Controller()
export class PublicController {
    constructor(
        private readonly productService: ProductService,
        private readonly orderInProgressService: OrderInProgressService,
        private readonly categoryService: CategoryService,
        private readonly refreshService: RefreshService,
        private readonly SABYService: SABYService,
    ) {}

    @Get()
    doSmt() {
        // return this.refreshService.RefreshDataBase();
        // return this.orderInProgressService.getAllByKey('bbd645ae-401f-4a20-8dba-f7995f6af4fe');
        return 'aboba';
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
        if (orderState.state == 220) {
            this.orderInProgressService.deleteByKeys([orderInfo.key]);
            return;
        }
        if (orderState.state >= 21 && orderState.state <= 91) {
            console.log(orderInfo);
            console.log(orderState);
            if (orderState.payments[0]?.id) {
                this.orderInProgressService.setPayStateByKey(orderInfo.key);
                return;
            }
            this.orderInProgressService.insertOrderFromSABYOrder(
                orderInfo,
                orderState.state,
            );
        }
        if (orderState.state == 200) {
            this.orderInProgressService.deleteByKeys([orderInfo.key]);
            return;
        }
    }
}
