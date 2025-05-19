import { Inject, Injectable } from '@nestjs/common';
import { telegram_user_repository_name } from 'src/constants';
import { Repository } from 'typeorm';
import { TelegramUser } from '../entities';

@Injectable()
export class TelegramUserService {
    constructor(
        @Inject(telegram_user_repository_name)
        private telegramUserRepository: Repository<TelegramUser>,
    ) {}

    async findAll(): Promise<TelegramUser[]> {
        return this.telegramUserRepository.find({
            relations: {
                SABYUser: true,
            },
        });
    }

    async findOneByTgId(tgId: number) {
        return this.telegramUserRepository.findOne({
            where: {
                tgId: tgId,
            },
        });
    }

    async saveOne(tgUser: TelegramUser) {
        return this.telegramUserRepository.insert(tgUser);
    }

    async saveMany(tgUsers: TelegramUser[]) {
        return this.telegramUserRepository.insert(tgUsers);
    }
}
