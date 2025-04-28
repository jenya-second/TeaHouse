import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
} from 'typeorm';
import { CategoryEntity, SABYProduct } from '@tea-house/types';
import { Product } from '.';

@Entity()
export class Category implements CategoryEntity {
    constructor(category: SABYProduct) {
        if (!category) return;
        this.name = category.name;
        this.description = category.description;
        this.descriptionSimple = category.description_simple;
        this.indexNumber = category.indexNumber;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string;

    @Column('text')
    description: string;

    @Column('text')
    descriptionSimple: string;

    @Column('int4')
    indexNumber: number;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];

    // @OneToMany(() => Product, (product) => product.subcategory)
    // subproducts: Product[];

    @OneToMany(() => Category, (category) => category.parentCategory)
    subcategories: Category[];

    @ManyToOne(() => Category, (category) => category.subcategories)
    parentCategory: Category;
}
