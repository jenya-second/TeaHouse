import ProductEntity from './ProductEntity';

export interface ImageEntity {
    id: number;
    sabyUrl: string;
    product: ProductEntity;
}

export default ImageEntity;
