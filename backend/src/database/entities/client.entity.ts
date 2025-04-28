import { ClientEntity } from '@tea-house/types';
import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Order, OrderInProgress, Promotion } from '.';

@Entity()
export class Client implements ClientEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    uuid: string;

    @Column('text')
    name: string;

    @Column('text')
    phone: string;

    @Column('int4')
    num: number;

    @OneToMany(() => Order, (order) => order.client)
    orders: Order[];

    @OneToMany(
        () => OrderInProgress,
        (orderInProgress) => orderInProgress.client,
    )
    ordersInProgress: OrderInProgress[];

    // @ManyToOne(() => Promotion, (promotion) => promotion.clients)
    // promotion: Promotion;
}
