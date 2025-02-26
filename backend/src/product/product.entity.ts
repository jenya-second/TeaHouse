import SABYProduct from 'src/types/SABYProduct';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Image } from 'src/image/image.entity';

@Entity()
export class Product {
    constructor(product: SABYProduct) {
        this.name = product?.name;
        this.cost = product?.cost;
        this.description = product?.description;
        this.descriptionSimple = product?.description_simple;
    }
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string;

    @Column('int4')
    cost: number;

    @Column('text')
    description: string;

    @Column('text')
    descriptionSimple: string;

    @OneToMany(() => Image, (image) => image.product)
    images: Image[];
}
