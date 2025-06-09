import { Controller, Get, Param, Post, Request, Delete } from '@nestjs/common';
import {
    OrderInProgressService,
    OrderService,
    TelegramUserService,
} from './database/services';
import { SABYService } from './SABY/saby.service';
import {
    Delivery,
    SABYDelivery,
    SABYOrderInProgress,
    SABYOrderState,
} from '@tea-house/types';
import { Request as ExpRequest } from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly telegramUserService: TelegramUserService,
        private readonly orderInProgressService: OrderInProgressService,
        private readonly orderService: OrderService,
        private readonly SABYService: SABYService,
    ) {}

    @Post('newOrder')
    async postNewOrder(@Request() req: ExpRequest) {
        const deliveryData: Delivery = req.body.deliveryData;
        const actual = new Date();
        const initData = new URLSearchParams(req.headers.authorization);
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

    @Get('completedOrders')
    async getCompletedOrders(@Request() req: ExpRequest) {
        const initData = new URLSearchParams(req.headers.authorization);
        const userId = JSON.parse(initData.get('user')).id;
        return this.orderService.findByUser(userId);
    }

    @Get('completedOrders/:key')
    async getCompleteOrderByKey(
        @Request() req: ExpRequest,
        @Param('key') key: string,
    ) {
        const initData = new URLSearchParams(req.headers.authorization);
        const userId = JSON.parse(initData.get('user')).id;
        const order = await this.orderService.getOneByKey(key);
        if (order?.client?.tgUser?.tgId != userId) return '';
        return order;
    }

    @Get('ordersInProgress')
    async getOrdersInProgress(@Request() req: ExpRequest) {
        const initData = new URLSearchParams(req.headers.authorization);
        const userId = JSON.parse(initData.get('user')).id;
        return this.orderInProgressService.findByUser(userId);
    }

    @Get('ordersInProgress/:key')
    async getOrderInProgressByKey(
        @Request() req: ExpRequest,
        @Param('key') key: string,
    ) {
        const initData = new URLSearchParams(req.headers.authorization);
        const userId = JSON.parse(initData.get('user')).id;
        const order = await this.orderInProgressService.getAllByKey(key);
        if (order[0]?.client?.tgUser?.tgId != userId) return '';
        return order;
    }

    @Get('orderState/:key')
    async getOrderStateByKey(
        @Request() req: ExpRequest,
        @Param('key') key: string,
    ) {
        const initData = new URLSearchParams(req.headers.authorization);
        const userId = JSON.parse(initData.get('user')).id;
        const order = await this.orderInProgressService.getAllByKey(key);
        if (order[0]?.client?.tgUser?.tgId != userId) return false;
        let state: SABYOrderState;
        try {
            state = await this.SABYService.GetOrderState(key);
        } catch (e) {
            return false;
        }
        return state;
    }

    @Get('payment/:key')
    async getPaymentLink(
        @Request() req: ExpRequest,
        @Param('key') key: string,
    ) {
        const initData = new URLSearchParams(req.headers.authorization);
        const userId = JSON.parse(initData.get('user')).id;
        const order = await this.orderInProgressService.getAllByKey(key);
        if (order[0]?.client?.tgUser?.tgId != userId) return '';
        return this.SABYService.GetPaymentLink(key);
    }

    @Delete(':orderId')
    async deleteNewOrder(
        @Request() req: ExpRequest,
        @Param('orderId') id: number,
    ) {
        const initData = new URLSearchParams(req.headers.authorization);
        const userId = JSON.parse(initData.get('user')).id;
        const order = await this.orderInProgressService.findById(id);
        if (order?.client?.tgUser?.tgId != userId) return false;
        if (order.payState) return;
        const ans: { success: boolean } = await this.SABYService.CancelOrder(
            order.key,
        );
        if (ans.success)
            await this.orderInProgressService.deleteByKeys([order.key]);
        return ans.success;
    }
}
