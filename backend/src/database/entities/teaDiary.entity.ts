import { TeaDiaryEntity } from '@tea-house/types';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Client, Product } from '.';

@Entity()
export class TeaDiary implements TeaDiaryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    impression: string;

    @Column('text')
    taste: string;

    @Column('text')
    smell: string;

    @Column('text')
    afterstate: string;

    @Column('int')
    rank: number;

    @ManyToOne(() => Client, (client) => client.teaDiary)
    client: Client;

    @ManyToOne(() => Product, (product) => product.teaDiary)
    product: Product;
}
