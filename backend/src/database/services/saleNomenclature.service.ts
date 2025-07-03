import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { sale_nomenclatures_rpository_name } from 'src/constants';
import { In, InsertResult, Repository } from 'typeorm';
import { SaleNomenclature } from '../entities';
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
        const dbNomenclatures = await this.findByKeys(
            saleNomenclatures.map((val) => val.key),
        );
        const orders = await await this.orderService.findByKeys(
            saleNomenclatures.map((val) => val.order.key),
        );
        const toSave = [];
        for (let i = 0; i < saleNomenclatures.length; i++) {
            const salenom = dbNomenclatures.find(
                (val) => val.key == saleNomenclatures[i].key,
            );
            saleNomenclatures[i].order = orders.find(
                (val) => val.key == saleNomenclatures[i].order.key,
            );
            if (!salenom) toSave.push(saleNomenclatures[i]);
        }
        this.saleNomenclatureRepository.save(toSave);
    }

    async findByKeys(keys: string[]) {
        return this.saleNomenclatureRepository.find({
            where: {
                key: In(keys),
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
