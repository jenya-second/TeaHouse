import { product_rpository_name } from 'src/constants';
import { Product } from './product.entity';
import { Inject, Injectable } from '@nestjs/common';
import { RemoveOptions, Repository } from 'typeorm';

@Injectable()
export class ProductService {
    constructor(
        @Inject(product_rpository_name)
        private productRepository: Repository<Product>,
    ) {}

    async findAll(): Promise<Product[]> {
        return this.productRepository.find({
            relations: {
                images: true,
            },
        });
    }

    async saveOne(product: Product): Promise<Product> {
        return this.productRepository.save(product);
    }

    async saveMany(products: Product[]): Promise<Product[]> {
        return this.productRepository.save(products);
    }

    async deleteAll(): Promise<any> {
        return this.productRepository.query('delete from public.product');
    }
}
