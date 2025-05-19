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
    pressAmount: number;
    externalId: string;
    indexNumber: number;
    nomNumber: string;
    unit: string;
    published: boolean;
    balance: number;
    images: ImageEntity[];
    category: CategoryEntity;
    saleNomenclatures: SaleNomenclatureEntity[];
}

export default ProductEntity;
