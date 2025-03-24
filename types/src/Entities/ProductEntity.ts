import SABYProduct from 'src/SABY/SABYProduct';
import ImageEntity from './ImageEntity';
import CategoryEntity from './CategoryEntity';

export class ProductEntity {
    constructor(product: SABYProduct) {
        this.name = product?.name;
        this.cost = product?.cost;
        this.description = product?.description;
        this.descriptionSimple = product?.description_simple;
        this.press = product?.attributes?.Прессовка == 'Да';
        this.externalId = product?.externalId;
        this.indexNumber = product?.indexNumber;
        this.nomNumber = product?.nomNumber;
        this.unit = product?.unit;
        this.published = product?.published;
    }
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
}

export default ProductEntity;
