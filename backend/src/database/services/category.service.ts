import { category_rpository_name } from 'src/constants';
import { Category } from '../entities';
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
    constructor(
        @Inject(category_rpository_name)
        private categoryRepository: Repository<Category>,
    ) {}

    async findAll(): Promise<Category[]> {
        return this.categoryRepository.find({
            order: {
                id: 'ASC',
                products: {
                    id: 'ASC',
                },
                subcategories: {
                    id: 'ASC',
                },
            },
            select: {
                products: {
                    id: true,
                    images: true,
                    cost: true,
                    name: true,
                    unit: true,
                },
                subcategories: {
                    id: true,
                },
                parentCategory: {
                    id: true,
                },
                id: true,
                name: true,
            },
            relations: {
                products: {
                    images: true,
                },
                subcategories: true,
                parentCategory: true,
            },
        });
    }

    async saveOne(category: Category): Promise<Category> {
        return this.categoryRepository.save(category);
    }

    async saveMany(categories: Category[]): Promise<Category[]> {
        return this.categoryRepository.save(categories);
    }

    async deleteAll(): Promise<any> {
        return this.categoryRepository.query('delete from public.category');
    }
}
