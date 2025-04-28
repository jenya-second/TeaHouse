import { Inject, Injectable } from '@nestjs/common';
import { InsertResult, Repository } from 'typeorm';
import { Promotion } from '../entities';
import { promotion_rpository_name } from 'src/constants';

@Injectable()
export class PromotionService {
    constructor(
        @Inject(promotion_rpository_name)
        private promotionRepository: Repository<Promotion>,
    ) {}

    async findAll(): Promise<Promotion[]> {
        return this.promotionRepository.find();
    }

    async saveOne(promotion: Promotion): Promise<InsertResult> {
        return this.promotionRepository.insert(promotion);
    }

    async findOneByName(name: string) {
        return this.promotionRepository.findOne({
            where: {
                name: name,
            },
        });
    }

    async saveMany(promotions: Promotion[]): Promise<InsertResult> {
        return this.promotionRepository.insert(promotions);
    }

    async deleteAll(): Promise<any> {
        return this.promotionRepository.query('delete from public.promotion');
    }
}
