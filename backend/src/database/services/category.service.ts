import { category_rpository_name } from 'src/constants';
import { Category, Product } from '../entities';
import { Inject, Injectable } from '@nestjs/common';
import { InsertResult, IsNull, Like, Or, Repository } from 'typeorm';

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
                    images: {
                        id: true,
                    },
                    cost: true,
                    name: true,
                    unit: true,
                    balance: true,
                    press: true,
                    pressAmount: true,
                    nomNumber: true,
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

    async findProductsByCategoryName(name: string): Promise<Product[]> {
        const cat = await this.categoryRepository.find({
            where: {
                parentCategory: IsNull(),
                name: Like(name),
            },
            select: {
                subcategories: {
                    id: true,
                    products: true,
                },
                id: true,
            },
            relations: {
                subcategories: {
                    products: true,
                },
            },
        });
        const ans = [];
        cat[0].subcategories.forEach((val) => ans.push(...val.products));
        return ans;
    }

    async updateCategoties(categories: Category[]) {
        await this.deleteAll();
        return this.categoryRepository.save(categories);
    }

    async findOneByIndexNumber(indexNumber: number) {
        return this.categoryRepository.findOne({
            where: {
                indexNumber: indexNumber,
            },
        });
    }

    async saveOne(category: Category): Promise<InsertResult> {
        return this.categoryRepository.insert(category);
    }

    async saveMany(categories: Category[]): Promise<InsertResult> {
        return this.categoryRepository.insert(categories);
    }

    async deleteAll(): Promise<any> {
        return this.categoryRepository.query('delete from public.category');
    }
}
