import { ImageEntity } from '@tea-house/types';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Product } from '.';

@Entity()
export class Image implements ImageEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    sabyUrl: string;

    @ManyToOne((type) => Product, (product) => product.images)
    product: Product;
}
