import { Injectable, Inject } from '@nestjs/common';
import { order_in_progress_rpository_name } from 'src/constants';
import { Repository, InsertResult, In } from 'typeorm';
import { Client, OrderInProgress, SaleNomenclature } from '../entities';
import { SaleNomenclatureService } from './saleNomenclature.service';
import { SABYOrderInProgress } from '@tea-house/types';
import { ClientService } from './client.service';
import { ProductService } from './product.service';

@Injectable()
export class OrderInProgressService {
    constructor(
        @Inject(order_in_progress_rpository_name)
        private orderInProgressRepository: Repository<OrderInProgress>,
        private readonly saleNomenclaturesService: SaleNomenclatureService,
        private readonly clientService: ClientService,
        private readonly productService: ProductService,
    ) {}

    async findAll(): Promise<OrderInProgress[]> {
        return this.orderInProgressRepository.find();
    }

    async saveOne(order: OrderInProgress): Promise<InsertResult> {
        return this.orderInProgressRepository.insert(order);
    }

    async saveMany(orders: OrderInProgress[]): Promise<InsertResult> {
        return this.orderInProgressRepository.insert(orders);
    }

    async findAllByKey(key: string) {
        return this.orderInProgressRepository.find({
            where: {
                key: key,
            },
        });
    }

    // async updateOrdersInProgress(orders: OrderInProgress[]) {
    //     for (let i = 0; i < orders.length; i++) {
    //         const order = await this.findOneByKey(orders[i].key);
    //         if (order) orders[i].id = order.id;
    //         const del = await this.saleNomenclaturesService.findByOrderKey(
    //             orders[i].key,
    //         );
    //         await this.saleNomenclaturesService.deleteByIds(
    //             del.map((val) => val.id),
    //         );
    //     }
    //     return this.orderInProgressRepository.save(orders);
    // }

    async insertOrderFromSABYOrder(order: SABYOrderInProgress, state: number) {
        const saleNomenclatures: SaleNomenclature[] = [];
        const existenOrder = await this.findByKeys([order.id]);
        if (existenOrder.find((val) => val.state == state)) return;
        const newOrder = new OrderInProgress(order);
        newOrder.state = state;
        let client = await this.clientService.findByPhone(order.customer.phone);
        if (!client) {
            client = new Client();
            client.phone = order.customer.phone;
            client.name = order.customer.name;
            await this.clientService.saveOne(client);
        }
        newOrder.client = client;
        for (let j = 0; j < order.nomenclatures.length; j++) {
            const nom = order.nomenclatures[j];
            const salenom = new SaleNomenclature(null);
            salenom.orderInProgress = newOrder;
            salenom.quantity = nom.count;
            salenom.totalPrice = nom.totalPrice;
            salenom.checkSum = nom.totalPrice;
            salenom.checkPrice = nom.cost;
            salenom.checkDiscount = nom.totalSum - nom.totalPrice;
            salenom.totalDiscount = nom.totalSum - nom.totalPrice;
            salenom.product = await this.productService.findByNomNumber(
                nom.nomNumber,
            );
            saleNomenclatures.push(salenom);
        }
        await this.orderInProgressRepository.insert(newOrder);
        await this.saleNomenclaturesService.saveMany(saleNomenclatures);
    }

    async findByKeys(keys: string[]): Promise<OrderInProgress[]> {
        return this.orderInProgressRepository.find({
            where: {
                key: In(keys),
            },
        });
    }

    async deleteByIds(ids: number[]) {
        return this.orderInProgressRepository.delete({
            id: In(ids),
        });
    }

    async deleteByKey(key: string) {
        return this.orderInProgressRepository.delete({
            key: key,
        });
    }

    async deleteAll(): Promise<any> {
        return this.orderInProgressRepository.query(
            'delete from public.order_in_progress',
        );
    }
}
