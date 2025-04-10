import ImageEntity from './ImageEntity';
import CategoryEntity from './CategoryEntity';
import SaleNomenclatureEntity from './SaleNomenclatureEntity';

export interface ProductEntity {
    id: number;
    name: string;
    cost: number;
    description: string;
    descriptionSimple: string;
    press: boolean;
    externalId: string;
    indexNumber: number;
    nomNumber: string;
    unit: string;
    published: boolean;
    images: ImageEntity[];
    category: CategoryEntity;
    saleNomenclatures: SaleNomenclatureEntity[];
}

export default ProductEntity;
