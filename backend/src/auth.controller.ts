import {
    Controller,
    Get,
    Param,
    Post,
    Request,
    Delete,
    Inject,
} from '@nestjs/common';
import {
    ClientService,
    OrderInProgressService,
    OrderService,
    ProductService,
    TeaDiaryService,
    TelegramUserService,
} from './database/services';
import { SABYService } from './SABY/saby.service';
import {
    Comment,
    Delivery,
    SABYDelivery,
    SABYOrderInProgress,
    SABYOrderState,
    TeaDiaryRequest,
} from '@tea-house/types';
import { Request as ExpRequest } from 'express';
import { frontend_main_page, telegram_bot } from './constants';
import { OichaiBot } from './telegram/telegram.bot';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly telegramUserService: TelegramUserService,
        private readonly orderInProgressService: OrderInProgressService,
        private readonly orderService: OrderService,
        private readonly SABYService: SABYService,
        private readonly teaDiaryService: TeaDiaryService,
        @Inject(telegram_bot)
        private readonly telegramBot: OichaiBot,
    ) {}

    @Post('newOrder')
    async postNewOrder(@Request() req: ExpRequest) {
        const deliveryData: Delivery = req.body.deliveryData;
        const actual = new Date();
        const initData = new URLSearchParams(req.headers.authorization);
        const userId = JSON.parse(initData.get('user')).id;
        const telegramUser =
            await this.telegramUserService.findOneByTgId(userId);
        const phone = telegramUser.phone;
        actual.setFullYear(actual.getFullYear() + 1);
        const comment: Comment = {
            Имя: deliveryData.client.name,
            Фамилия: deliveryData.client.lastname,
            Отчество: deliveryData.client.surname,
            Коментарий: '',
            Телефон: phone,
        };
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
                successURL: frontend_main_page,
                errorURL: frontend_main_page,
                shopURL: frontend_main_page,
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
            comment.Телефон = deliveryData.client.phone;
            comment.Коментарий = deliveryData.delivery.comment;
        }
        delivery.comment = JSON.stringify(comment);
        const orderInProgress: SABYOrderInProgress =
            await this.SABYService.CreateOrder(delivery);
        const text = `Новый заказ от клиента ${orderInProgress.customer.name} @${telegramUser.username ?? ''} на сумму ${orderInProgress.totalPrice} р.`;
        this.telegramBot.SendMessageToUser(text, process.env.JENYA_CHAT_ID);
        this.telegramBot.SendMessageToUser(text, process.env.DIMA_CHAT_ID);
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

    @Get('whoami')
    async getUser(@Request() req: ExpRequest) {
        const initData = new URLSearchParams(req.headers.authorization);
        const user: {
            id: number;
            fisrt_name: string;
            last_name: string;
            username: string;
        } = JSON.parse(initData.get('user'));
        const client = await this.telegramUserService.findOneByTgId(user.id);
        if (!client) return false;
        if (
            client.firstName != user.fisrt_name ||
            client.lastName != user.last_name ||
            client.username != user.username
        ) {
            client.firstName = user.fisrt_name;
            client.lastName = user.last_name;
            client.username = user.username;
            await this.telegramUserService.updateUser(client);
        }
        return client;
    }

    @Get('teaDiary')
    async getTeaDiary(@Request() req: ExpRequest) {
        const initData = new URLSearchParams(req.headers.authorization);
        const userId = JSON.parse(initData.get('user')).id;
        return this.teaDiaryService.getByClientId(userId);
    }

    @Get('teaDiary/:productId')
    async getTeaDiaryByProduct(
        @Request() req: ExpRequest,
        @Param('productId') id: number,
    ) {
        const initData = new URLSearchParams(req.headers.authorization);
        const userId = JSON.parse(initData.get('user')).id;
        const teaDiaryForProduct =
            await this.teaDiaryService.findByClientAndProduct(id, userId);
        if (!teaDiaryForProduct) return false;
        return teaDiaryForProduct;
    }

    @Post('teaDiary')
    async saveTeaDiary(@Request() req: ExpRequest) {
        const teaDiaryInfo: TeaDiaryRequest = req.body.teaDiary;
        const id = teaDiaryInfo.productId;
        const initData = new URLSearchParams(req.headers.authorization);
        const userId = JSON.parse(initData.get('user')).id;
        const dbTeaDiary = await this.teaDiaryService.findByClientAndProduct(
            id,
            userId,
        );
        if (!dbTeaDiary) return false;
        dbTeaDiary.rank = Math.min(Math.max(teaDiaryInfo.rank, 0), 5);
        dbTeaDiary.impression = teaDiaryInfo.impression;
        dbTeaDiary.taste = teaDiaryInfo.taste;
        dbTeaDiary.smell = teaDiaryInfo.smell;
        dbTeaDiary.afterstate = teaDiaryInfo.afterstate;
        await this.teaDiaryService.saveOne(dbTeaDiary);
        return true;
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
