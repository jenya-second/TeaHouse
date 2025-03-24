import ProductEntity from './ProductEntity';
import SABYProduct from 'src/SABY/SABYProduct';

export class CategoryEntity {
    constructor(category: SABYProduct) {
        this.name = category?.name;
        this.description = category?.description;
        this.descriptionSimple = category?.description_simple;
    }
    id: number;
    name: string;
    description: string;
    descriptionSimple: string;
    products: ProductEntity[];
    subcategories: CategoryEntity[];
    parentCategory: CategoryEntity;
}

export default CategoryEntity;
