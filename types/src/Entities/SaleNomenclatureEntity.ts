import { OrderEntity } from './OrderEntity';
import ProductEntity from './ProductEntity';

export interface SaleNomenclatureEntity {
    id: number;
    checkDiscount: number;
    checkPrice: number;
    checkSum: number;
    key: string;
    manualPrice: number;
    quantity: number;
    totalDiscount: number;
    totalPrice: number;
    totalCost: number;
    product: ProductEntity;
    order: OrderEntity;
}

export default SaleNomenclatureEntity;
