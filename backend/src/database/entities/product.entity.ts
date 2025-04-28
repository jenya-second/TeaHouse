import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
} from 'typeorm';
import { ProductEntity, SABYProduct } from '@tea-house/types';
import { Category, SaleNomenclature, Image } from '.';

@Entity()
export class Product implements ProductEntity {
    constructor(product: SABYProduct) {
        if (!product) return;
        this.name = product.name;
        this.cost = product.cost;
        this.description = product.description;
        this.descriptionSimple = product.description_simple;
        this.press = product.attributes.Прессовка == 'Да';
        this.externalId = product.externalId;
        this.indexNumber = product.indexNumber;
        this.nomNumber = product.nomNumber;
        this.unit = product.unit;
        this.published = product.published;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string;

    @Column('float')
    cost: number;

    @Column('text')
    description: string;

    @Column('text')
    descriptionSimple: string;

    @Column('text')
    externalId: string;

    @Column('text')
    indexNumber: number;

    @Column('text')
    nomNumber: string;

    @Column('boolean')
    press: boolean;

    @Column('boolean')
    published: boolean;

    @Column('text')
    unit: string;

    @Column('float')
    balance: number;

    @OneToMany(() => Image, (image) => image.product)
    images: Image[];

    @ManyToOne(() => Category, (category) => category.products)
    category: Category;

    @OneToMany(
        () => SaleNomenclature,
        (saleNomenclature) => saleNomenclature.order,
    )
    saleNomenclatures: SaleNomenclature[];
}
