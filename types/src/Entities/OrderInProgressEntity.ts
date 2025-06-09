import ClientEntity from './ClientEntity';
import SaleNomenclatureEntity from './SaleNomenclatureEntity';

export interface OrderInProgressEntity {
    id: number;
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
    state: number;
    payState: boolean;
}

export default OrderInProgressEntity;
