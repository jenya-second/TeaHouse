import { Inject, Injectable } from '@nestjs/common';
import { order_rpository_name } from 'src/constants';
import { In, InsertResult, Repository } from 'typeorm';
import { Order } from '../entities';
import { SaleNomenclatureService } from './saleNomenclature.service';

@Injectable()
export class OrderService {
    constructor(
        @Inject(order_rpository_name)
        private readonly orderRepository: Repository<Order>,
        private readonly saleNomenclatureService: SaleNomenclatureService,
    ) {}

    async findAll(): Promise<Order[]> {
        return this.orderRepository.find({
            relations: {
                client: true,
                saleNomenclatures: true,
            },
        });
    }

    async saveOne(order: Order): Promise<InsertResult> {
        return this.orderRepository.insert(order);
    }

    async saveMany(orders: Order[]): Promise<InsertResult> {
        return this.orderRepository.insert(orders);
    }

    /**
     * Require valid clients in objects
     */
    async updateOrders(orders: Order[]) {
        for (let i = 0; i < orders.length; i++) {
            const order = await this.orderRepository.findOne({
                where: {
                    key: orders[i].key,
                },
            });
            if (order) orders[i].id = order.id;
            const del = await this.saleNomenclatureService.findByOrderKey(
                orders[i].key,
            );
            await this.saleNomenclatureService.deleteByIds(
                del.map((val) => val.id),
            );
        }
        return this.orderRepository.save(orders);
    }

    async getOneByKey(key: string) {
        return this.orderRepository.findOne({
            relations: {
                client: {
                    tgUser: true,
                },
                saleNomenclatures: {
                    product: {
                        images: true,
                    },
                },
            },
            where: {
                key: key,
            },
        });
    }

    async findByUser(
        tgId: number,
        pagination?: number,
        page?: number,
    ): Promise<Order[]> {
        return this.orderRepository.find({
            select: {
                id: true,
                key: true,
                client: {
                    phone: true,
                    tgUser: {
                        tgId: true,
                    },
                },
                totalPrice: true,
                dateWTZ: true,
            },
            where: {
                client: {
                    tgUser: {
                        tgId: tgId,
                    },
                },
            },
            take: pagination,
            skip: pagination ? pagination * page : 0,
        });
    }

    async deleteAll(): Promise<any> {
        return this.orderRepository.query('delete from public.order');
    }

    async deleteByIds(ids: number[]) {
        return this.orderRepository.delete({
            id: In(ids),
        });
    }

    async deleteByKeys(keys: string[]) {
        return this.orderRepository.delete({
            key: In(keys),
        });
    }
}
