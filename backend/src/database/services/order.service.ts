import { Inject, Injectable } from '@nestjs/common';
import { order_rpository_name } from 'src/constants';
import { Repository } from 'typeorm';
import { Order } from '../entities';

@Injectable()
export class OrderService {
    constructor(
        @Inject(order_rpository_name)
        private orderRepository: Repository<Order>,
    ) {}

    async findAll(): Promise<Order[]> {
        return this.orderRepository.find({
            relations: {
                client: true,
                saleNomenclatures: true,
            },
        });
    }

    async saveOne(order: Order): Promise<Order> {
        return this.orderRepository.save(order);
    }

    async saveMany(orders: Order[]): Promise<Order[]> {
        return this.orderRepository.save(orders);
    }

    async deleteAll(): Promise<any> {
        return this.orderRepository.query('delete from public.order');
    }
}
