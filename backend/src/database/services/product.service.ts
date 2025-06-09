import { product_rpository_name } from 'src/constants';
import { Inject, Injectable } from '@nestjs/common';
import { InsertResult, IsNull, Not, Repository } from 'typeorm';
import { SABYProduct } from '@tea-house/types';
import { Category, Product, Image } from '../entities';
import { CategoryService } from './category.service';

interface MyCategory {
    id: number;
    category: Category;
    parent?: MyCategory;
}

@Injectable()
export class ProductService {
    constructor(
        @Inject(product_rpository_name)
        private readonly productRepository: Repository<Product>,
        private readonly categoryService: CategoryService,
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

    async findByNomNumber(nomNumber: string) {
        return this.productRepository.findOne({
            where: {
                nomNumber: nomNumber,
            },
        });
    }

    async findById(id: number) {
        return this.productRepository.findOne({
            where: {
                id: id,
            },
            relations: {
                images: true,
                category: {
                    parentCategory: true,
                },
            },
        });
    }

    async saveOne(product: Product): Promise<InsertResult> {
        return this.productRepository.insert(product);
    }

    async saveMany(products: Product[]): Promise<InsertResult> {
        return this.productRepository.insert(products);
    }

    async updateProducts(products: Product[]) {
        const actualProducts: Product[] = await this.productRepository.find();
        for (let i = 0; i < actualProducts.length; i++) {
            const updateProductIndex = products.findIndex((val) => {
                return val.externalId === actualProducts[i].externalId;
            });
            if (updateProductIndex != -1) {
                products[updateProductIndex].id = actualProducts[i].id;
                Object.assign(actualProducts[i], products[updateProductIndex]);
                const category: Category =
                    await this.categoryService.findOneByIndexNumber(
                        actualProducts[i].category.indexNumber,
                    );
                actualProducts[i].category = category;
                products.splice(updateProductIndex, 1);
            } else {
                actualProducts[i].category = null;
            }
        }
        await this.productRepository.insert(products);
        return this.productRepository.save(actualProducts);
    }

    async deleteAll(): Promise<any> {
        return this.productRepository.query('delete from public.product');
    }

    parceList(SABYproducts: SABYProduct[]): [Image[], Product[], Category[]] {
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
