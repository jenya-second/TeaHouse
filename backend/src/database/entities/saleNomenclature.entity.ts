import { SABYSaleNomenclature, SaleNomenclatureEntity } from '@tea-house/types';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order, Product } from '.';

@Entity()
export class SaleNomenclature implements SaleNomenclatureEntity {
    constructor(saleNomenclature: SABYSaleNomenclature) {
        if (!saleNomenclature) return;
        this.checkDiscount = saleNomenclature.CheckDiscount;
        this.checkPrice = saleNomenclature.CheckPrice;
        this.checkSum = saleNomenclature.CheckSum;
        this.key = saleNomenclature.Key;
        this.manualPrice = saleNomenclature.ManualPrice;
        this.quantity = saleNomenclature.Quantity;
        this.totalDiscount = saleNomenclature.TotalDiscount;
        this.totalPrice = saleNomenclature.TotalPrice;
        this.totalCost = saleNomenclature.TotalCost;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column('int4')
    checkDiscount: number;

    @Column('int4')
    checkPrice: number;

    @Column('int4')
    checkSum: number;

    @Column('text')
    key: string;

    @Column('int4')
    manualPrice: number;

    @Column('int4')
    quantity: number;

    @Column('int4')
    totalDiscount: number;

    @Column('int4')
    totalPrice: number;

    @Column('int4')
    totalCost: number;

    @ManyToOne(() => Product, (product) => product.saleNomenclatures)
    product: Product;

    @ManyToOne(() => Order, (order) => order.saleNomenclatures)
    order: Order;
}
