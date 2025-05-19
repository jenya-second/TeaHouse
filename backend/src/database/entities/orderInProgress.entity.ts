import { OrderInProgressEntity, SABYOrderInProgress } from '@tea-house/types';
import { Client, SaleNomenclature } from '.';
import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class OrderInProgress implements OrderInProgressEntity {
    constructor(orderInProgress: SABYOrderInProgress) {
        if (!orderInProgress) return;
        this.key = orderInProgress.key;
        this.number = orderInProgress.number;
        this.comment = orderInProgress.comment;
        this.datetime = orderInProgress.datetime;
        this.address = orderInProgress.delivery.address;
        this.addressJSON = orderInProgress.delivery.addressJSON;
        this.isPickup = orderInProgress.delivery.isPickup;
        switch (orderInProgress.paymentType) {
            case 1: {
                this.paymentType = 'card';
                break;
            }
            case 2: {
                this.paymentType = 'online';
                break;
            }
            case 3: {
                this.paymentType = 'cash';
                break;
            }
        }
        this.totalPrice = orderInProgress.totalPrice;
        this.totalSum = orderInProgress.totalSum;
        this.totalDiscount = orderInProgress.totalDiscount;
    }

    @PrimaryGeneratedColumn()
    id: string;

    @Column('text')
    key: string;

    @Column('int4')
    number: number;

    @Column('text')
    comment: string;

    @Column('text')
    datetime: string;

    @Column('text')
    address: string;

    @Column('text')
    addressJSON: string;

    @Column('boolean')
    isPickup: boolean;

    @Column('text')
    paymentType: 'card' | 'online' | 'cash';

    @Column('float4')
    totalPrice: number;

    @Column('float4')
    totalSum: number;

    @Column('float4')
    totalDiscount: number;

    @Column('int4')
    state: number;

    @ManyToOne(() => Client, (client) => client.ordersInProgress)
    client: Client;

    @OneToMany(
        () => SaleNomenclature,
        (nomenclature) => nomenclature.orderInProgress,
    )
    nomenclatures: SaleNomenclature[];
}
