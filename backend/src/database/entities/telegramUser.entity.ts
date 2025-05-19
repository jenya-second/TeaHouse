import { TelegramUserEntity } from '@tea-house/types';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Client } from './client.entity';

@Entity()
export class TelegramUser implements TelegramUserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    phone: string;

    @Column('text')
    username: string;

    @Column('text')
    firstName: string;

    @Column('text')
    lastName: string;

    @Column('int8')
    tgId: number;

    @OneToOne(() => Client, (client) => client.tgUser)
    SABYUser: Client;
}
