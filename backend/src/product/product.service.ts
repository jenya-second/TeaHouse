import { product_rpository_name } from 'src/constants';
import { Product } from './product.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SABYProduct } from '@tea-house/types';
import { Image } from '../image/image.entity';
import { Category } from 'src/categories/category.entity';

interface MyCategory {
    id: number;
    category: Category;
    parent?: MyCategory;
}

@Injectable()
export class ProductService {
    constructor(
        @Inject(product_rpository_name)
        private productRepository: Repository<Product>,
    ) {}

    async findAll(): Promise<Product[]> {
        return this.productRepository.find({
            select: {
                press: true, //somehow always pop up, mb type-orm bug
                unit: true,
                cost: true,
                images: {
                    id: true,
                },
                category: {
                    name: true,
                },
                name: true,
                description: true,
            },
            relations: {
                images: true,
                category: true,
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

    parceList(
        SABYproducts: SABYProduct[],
    ): [images: Image[], products: Product[], categories: Category[]] {
        const images: Image[] = [];
        const products: Product[] = [];
        const categories: MyCategory[] = [];
        for (const SABYproduct of SABYproducts) {
            if (SABYproduct?.isParent) {
                const newCategory = new Category(SABYproduct);
                const parent = categories.find(
                    (c) => SABYproduct.hierarchicalParent == c.id,
                );
                newCategory.parentCategory = parent?.category;
                categories.push({
                    id: SABYproduct.hierarchicalId,
                    category: newCategory,
                    parent: parent,
                });
                continue;
            }
            const newProduct = new Product(SABYproduct);
            const cat = categories.find(
                (c) => SABYproduct.hierarchicalParent == c.id,
            );
            newProduct.category = this.get2LastCategories(cat);
            products.push(newProduct);
            if (SABYproduct?.images == null) continue;
            images.push(
                ...SABYproduct.images.map((image: string) => {
                    const img: Image = new Image();
                    img.sabyUrl = image;
                    img.product = newProduct;
                    return img;
                }),
            );
        }
        const allCategories: Category[] = [];
        allCategories.push(...categories.map((c) => c.category));
        return [images, products, allCategories];
    }

    private get2LastCategories(category: MyCategory): Category {
        if (category.parent == null) {
            return category.category;
        }
        while (category.parent.parent != null) {
            category = category.parent;
        }
        return category.category;
    }
}
