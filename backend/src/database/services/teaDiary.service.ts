import { Inject, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { tea_diary_repository_name } from 'src/constants';
import { TeaDiary } from '../entities/teaDiary.entity';
import { Product } from '../entities';

@Injectable()
export class TeaDiaryService {
    constructor(
        @Inject(tea_diary_repository_name)
        private teaDiaryRepository: Repository<TeaDiary>,
    ) {}

    async saveOne(teaDiary: TeaDiary) {
        return this.teaDiaryRepository.save(teaDiary);
    }

    async saveMany(teaDiary: TeaDiary[]) {
        return this.teaDiaryRepository.save(teaDiary);
    }

    async updateTeaDiary(teaDiary: TeaDiary[]) {
        const dbTeaDiary = await this.findByProducts(
            teaDiary.map((val) => val.product),
        );
        const toSave = [];
        for (let i = 0; i < teaDiary.length; i++) {
            if (!teaDiary[i].client || !teaDiary[i].product) continue;
            const notInDb = dbTeaDiary.find(
                (val) =>
                    val.product.id == teaDiary[i].product.id &&
                    val.client.id == teaDiary[i].client.id,
            );
            const notInLocalTeaDiary = toSave.find(
                (val) =>
                    val.product.id == teaDiary[i].product.id &&
                    val.client.id == teaDiary[i].client.id,
            );
            if (!notInDb && !notInLocalTeaDiary) {
                toSave.push(teaDiary[i]);
            }
        }
        return this.teaDiaryRepository.insert(toSave);
    }

    async findByProducts(products: Product[]) {
        const productIds = products.map((val) => val.id);
        return this.teaDiaryRepository.find({
            where: {
                product: {
                    id: In(productIds),
                },
            },
            relations: {
                client: true,
                product: true,
            },
        });
    }

    async findByClientAndProduct(productId: number, clientId: number) {
        return this.teaDiaryRepository.findOne({
            where: {
                product: {
                    id: productId,
                },
                client: {
                    tgUser: {
                        tgId: clientId,
                    },
                },
            },
            relations: {
                product: {
                    images: true,
                },
            },
        });
    }

    async getByClientId(clientId: number) {
        return this.teaDiaryRepository.find({
            where: {
                client: {
                    tgUser: {
                        tgId: clientId,
                    },
                },
            },
            select: {
                id: true,
                rank: true,
                product: {
                    id: true,
                    name: true,
                    nomNumber: true,
                },
            },
            relations: {
                product: true,
            },
        });
    }
}
