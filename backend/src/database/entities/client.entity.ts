import { ClientEntity } from '@tea-house/types';
import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { Order, OrderInProgress, Promotion } from '.';
import { TelegramUser } from './telegramUser.entity';

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

    @OneToOne(() => TelegramUser, (telegramUser) => telegramUser.SABYUser)
    @JoinColumn()
    tgUser: TelegramUser;

    // @ManyToOne(() => Promotion, (promotion) => promotion.clients)
    // promotion: Promotion;
}
