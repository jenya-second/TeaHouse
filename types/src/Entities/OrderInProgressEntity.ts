import ClientEntity from './ClientEntity';
import SaleNomenclatureEntity from './SaleNomenclatureEntity';

export interface OrderInProgressEntity {
    id: string;
    key: string;
    number: number;
    comment: string;
    client: ClientEntity;
    datetime: string;
    nomenclatures: SaleNomenclatureEntity[];
    address: string;
    addressJSON: string;
    isPickup: boolean;
    paymentType: 'card' | 'online' | 'cash';
    totalPrice: number;
    totalSum: number;
    totalDiscount: number;
}

export default OrderInProgressEntity;
