import ClientEntity from './ClientEntity';
import SaleNomenclatureEntity from './SaleNomenclatureEntity';

export interface OrderEntity {
    id: number;
    client: ClientEntity;
    dateWTZ: string;
    // Payments: {
    //     Amount: number;
    //     CheckNumber: string;
    //     Comment: string;
    //     FiscalNumber: string;
    //     FiscalSign: string;
    //     Positions: number[];
    // }[];
    saleNomenclatures: SaleNomenclatureEntity[];
    key: string;
    number: number;
    openedWTZ: string;
    sale: number;
    saleName: string;
    totalDiscount: number;
    totalPrice: number;
}
