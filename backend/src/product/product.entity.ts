import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
} from 'typeorm';
import { Image } from 'src/image/image.entity';
import { ProductEntity } from '@tea-house/types';
import { Category } from 'src/categories/category.entity';

@Entity()
export class Product extends ProductEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string;

    @Column('int4')
    cost: number;

    @Column('text')
    description: string;

    @Column('text')
    descriptionSimple: string;

    @Column('text')
    externalId: string;

    @Column('text')
    indexNumber: number;

    @Column('text')
    nomNumber: string;

    @Column('boolean')
    press: boolean;

    @Column('boolean')
    published: boolean;

    @Column('text')
    unit: string;

    @OneToMany(() => Image, (image) => image.product)
    images: Image[];

    @ManyToOne(() => Category, (category) => category.products)
    category: Category;

    // @ManyToOne(() => Category, (category) => category.subproducts)
    // subcategory: Category;
}
