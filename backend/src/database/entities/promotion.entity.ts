import { PromotionEntity } from '@tea-house/types';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Client } from './client.entity';

@Entity()
export class Promotion implements PromotionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string;

    @Column('float4')
    discountPercentage: number;

    // @OneToMany(() => Client, (client) => client.promotion)
    clients: Client[];
}
