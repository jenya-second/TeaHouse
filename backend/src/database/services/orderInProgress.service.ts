import { Injectable, Inject } from '@nestjs/common';
import { order_in_progress_rpository_name } from 'src/constants';
import { Repository, InsertResult, In } from 'typeorm';
import { OrderInProgress } from '../entities';
import { SaleNomenclatureService } from './saleNomenclature.service';

@Injectable()
export class OrderInProgressService {
    constructor(
        @Inject(order_in_progress_rpository_name)
        private orderInProgressRepository: Repository<OrderInProgress>,
        private readonly saleNomenclaturesService: SaleNomenclatureService,
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

    async findOneByKey(key: string) {
        return this.orderInProgressRepository.findOne({
            where: {
                key: key,
            },
        });
    }

    async updateOrdersInProgress(orders: OrderInProgress[]) {
        for (let i = 0; i < orders.length; i++) {
            const order = await this.findOneByKey(orders[i].key);
            if (order) orders[i].id = order.id;
            const del = await this.saleNomenclaturesService.findByOrderKey(
                orders[i].key,
            );
            await this.saleNomenclaturesService.deleteByIds(
                del.map((val) => val.id),
            );
        }
        return this.orderInProgressRepository.save(orders);
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

    async deleteAll(): Promise<any> {
        return this.orderInProgressRepository.query(
            'delete from public.order_in_progress',
        );
    }
}
