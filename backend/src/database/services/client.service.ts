import { Inject, Injectable } from '@nestjs/common';
import { client_rpository_name } from 'src/constants';
import { Client } from '../entities';
import { InsertResult, Repository } from 'typeorm';

@Injectable()
export class ClientService {
    constructor(
        @Inject(client_rpository_name)
        private clientRepository: Repository<Client>,
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
        for (let i = 0; i < clients.length; i++) {
            const client = await this.findOneByNum(clients[i].num);
            if (client) clients[i].id = client.id;
        }
        this.clientRepository.save(clients);
    }
}
