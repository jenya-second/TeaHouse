import { OrderEntity, SABYOrder } from '@tea-house/types';
import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Client, SaleNomenclature } from '.';

@Entity()
export class Order implements OrderEntity {
    constructor(Order: SABYOrder) {
        if (!Order) return;
        this.dateWTZ = Order.DateWTZ;
        this.key = Order.Key;
        this.number = Order.Number;
        this.openedWTZ = Order.OpenedWTZ;
        this.sale = Order.Sale;
        this.saleName = Order.SaleName;
        this.totalDiscount = Order.TotalDiscount;
        this.totalPrice = Order.TotalPrice;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    dateWTZ: string;

    @Column('text')
    key: string;

    @Column('int4')
    number: number;

    @Column('text')
    openedWTZ: string;

    @Column('int4')
    sale: number;

    @Column('text')
    saleName: string;

    @Column('float4')
    totalDiscount: number;

    @Column('float4')
    totalPrice: number;

    @ManyToOne(() => Client, (client) => client.orders)
    client: Client;

    @OneToMany(
        () => SaleNomenclature,
        (saleNomenclature) => saleNomenclature.order,
    )
    saleNomenclatures: SaleNomenclature[];
}
