import { SABYSaleNomenclature, SaleNomenclatureEntity } from '@tea-house/types';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order, Product, OrderInProgress } from '.';

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

    @Column('float4')
    checkDiscount: number;

    @Column('float4')
    checkPrice: number;

    @Column('float4')
    checkSum: number;

    @Column('text')
    key: string;

    @Column('float4')
    manualPrice: number;

    @Column('float4')
    quantity: number;

    @Column('float4')
    totalDiscount: number;

    @Column('float4')
    totalPrice: number;

    @Column('float4')
    totalCost: number;

    @ManyToOne(() => Product, (product) => product.saleNomenclatures)
    product: Product;

    @ManyToOne(() => Order, (order) => order.saleNomenclatures)
    order: Order;

    @ManyToOne(
        () => OrderInProgress,
        (orderInProgress) => orderInProgress.nomenclatures,
    )
    orderInProgress: OrderInProgress;
}
