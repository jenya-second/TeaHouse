import ProductEntity from './ProductEntity';

export interface CategoryEntity {
    id: number;
    name: string;
    description: string;
    descriptionSimple: string;
    products: ProductEntity[];
    subcategories: CategoryEntity[];
    parentCategory: CategoryEntity;
}

export default CategoryEntity;
