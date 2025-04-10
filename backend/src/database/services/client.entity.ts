import { Inject, Injectable } from '@nestjs/common';
import { client_rpository_name } from 'src/constants';
import { Client } from '../entities';
import { Repository } from 'typeorm';

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

    async saveOne(client: Client): Promise<Client> {
        return this.clientRepository.save(client);
    }

    async saveMany(clients: Client[]): Promise<Client[]> {
        return this.clientRepository.save(clients);
    }

    async deleteAll(): Promise<any> {
        return this.clientRepository.query('delete from public.client');
    }
}
