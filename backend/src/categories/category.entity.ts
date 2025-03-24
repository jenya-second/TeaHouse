import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
} from 'typeorm';
import { CategoryEntity } from '@tea-house/types';
import { Product } from 'src/product/product.entity';

@Entity()
export class Category extends CategoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string;

    @Column('text')
    description: string;

    @Column('text')
    descriptionSimple: string;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];

    // @OneToMany(() => Product, (product) => product.subcategory)
    // subproducts: Product[];

    @OneToMany(() => Category, (category) => category.parentCategory)
    subcategories: Category[];

    @ManyToOne(() => Category, (category) => category.subcategories)
    parentCategory: Category;
}
