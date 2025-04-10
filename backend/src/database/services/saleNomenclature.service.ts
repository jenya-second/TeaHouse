import { Inject, Injectable } from '@nestjs/common';
import { sale_nomenclatures_rpository_name } from 'src/constants';
import { Repository } from 'typeorm';
import { SaleNomenclature } from '../entities';

@Injectable()
export class SaleNomenclatureService {
    constructor(
        @Inject(sale_nomenclatures_rpository_name)
        private saleNomenclatureRepository: Repository<SaleNomenclature>,
    ) {}

    async findAll(): Promise<SaleNomenclature[]> {
        return this.saleNomenclatureRepository.find({
            relations: {
                product: true,
            },
        });
    }

    async saveOne(
        saleNomenclature: SaleNomenclature,
    ): Promise<SaleNomenclature> {
        return this.saleNomenclatureRepository.save(saleNomenclature);
    }

    async saveMany(
        saleNomenclatures: SaleNomenclature[],
    ): Promise<SaleNomenclature[]> {
        return this.saleNomenclatureRepository.save(saleNomenclatures);
    }

    async deleteAll(): Promise<any> {
        return this.saleNomenclatureRepository.query(
            'delete from public.saleNomenclature',
        );
    }
}
