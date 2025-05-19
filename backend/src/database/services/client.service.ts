import { Inject, Injectable } from '@nestjs/common';
import { client_rpository_name } from 'src/constants';
import { Client } from '../entities';
import { InsertResult, Repository } from 'typeorm';
import { TelegramUserService } from './telegramUser.service';

@Injectable()
export class ClientService {
    constructor(
        @Inject(client_rpository_name)
        private clientRepository: Repository<Client>,
        private telegramUserService: TelegramUserService,
    ) {}

    async findAll(): Promise<Client[]> {
        return this.clientRepository.find({
            relations: {
                orders: true,
            },
        });
    }

    async findByCustomerId(num: number): Promise<Client> {
        return this.clientRepository.findOne({
            where: {
                num: num,
            },
        });
    }

    async saveOne(client: Client): Promise<InsertResult> {
        return this.clientRepository.insert(client);
    }

    async saveMany(clients: Client[]): Promise<InsertResult> {
        return this.clientRepository.insert(clients);
    }

    async deleteAll(): Promise<any> {
        return this.clientRepository.query('delete from public.client');
    }

    async findOneByNum(num: number) {
        return this.clientRepository.findOne({
            where: {
                num: num,
            },
        });
    }

    async updateClients(clients: Client[]) {
        const tgUsers = await this.telegramUserService.findAll();
        const phones = tgUsers.map((val) => this.simplePhone(val.phone));
        for (let i = 0; i < clients.length; i++) {
            const client = await this.findOneByNum(clients[i].num);
            if (client) {
                clients[i].id = client.id;
                if (client.tgUser) clients[i].tgUser = client.tgUser;
            }
            if (!client?.tgUser) {
                const tgUserInd = phones.findIndex(
                    (val) => val == this.simplePhone(clients[i].phone),
                );
                if (tgUserInd != -1) clients[i].tgUser = tgUsers[tgUserInd];
            }
        }
        this.clientRepository.save(clients);
    }

    async findByPhone(phone: string) {
        const clients = await this.clientRepository.find();
        return clients.find(
            (val) => this.simplePhone(phone) == this.simplePhone(val.phone),
        );
    }

    simplePhone(phone: string) {
        return phone ? phone.replaceAll(/\+|\(|\)|-| /g, '') : '';
    }
}
