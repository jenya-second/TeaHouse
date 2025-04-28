import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { sale_nomenclatures_rpository_name } from 'src/constants';
import { In, InsertResult, Repository } from 'typeorm';
import { Order, SaleNomenclature } from '../entities';
import { OrderService } from './order.service';

@Injectable()
export class SaleNomenclatureService {
    constructor(
        @Inject(sale_nomenclatures_rpository_name)
        private saleNomenclatureRepository: Repository<SaleNomenclature>,
        @Inject(forwardRef(() => OrderService))
        private readonly orderService: OrderService,
    ) {}

    async findAll(): Promise<SaleNomenclature[]> {
        return this.saleNomenclatureRepository.find({
            relations: {
                product: true,
            },
        });
    }

    async saveOne(saleNomenclature: SaleNomenclature): Promise<InsertResult> {
        return this.saleNomenclatureRepository.insert(saleNomenclature);
    }

    async saveMany(
        saleNomenclatures: SaleNomenclature[],
    ): Promise<InsertResult> {
        return this.saleNomenclatureRepository.insert(saleNomenclatures);
    }

    async updateSaleNomenclatures(saleNomenclatures: SaleNomenclature[]) {
        for (let i = 0; i < saleNomenclatures.length; i++) {
            const salenom = await this.findOneByKey(saleNomenclatures[i].key);
            const order = await this.orderService.findOneByKey(
                saleNomenclatures[i].order.key,
            );
            if (salenom) saleNomenclatures[i].id = salenom.id;
            saleNomenclatures[i].order = order;
        }
        this.saleNomenclatureRepository.save(saleNomenclatures);
    }

    async findOneByKey(key: string) {
        return this.saleNomenclatureRepository.findOne({
            where: {
                key: key,
            },
        });
    }

    async findByOrderKey(orderKey: string): Promise<SaleNomenclature[]> {
        return this.saleNomenclatureRepository.find({
            where: {
                order: {
                    key: orderKey,
                },
            },
        });
    }

    async deleteByIds(ids: number[]) {
        return this.saleNomenclatureRepository.delete({
            id: In(ids),
        });
    }

    async deleteAll(): Promise<any> {
        return this.saleNomenclatureRepository.query(
            'delete from public.sale_nomenclature',
        );
    }
}
