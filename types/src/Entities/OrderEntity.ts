import SABYOrder, { SABYSaleNomenclature } from '../SABY/SABYOrder';
import ClientEntity from './ClientEntity';
import SaleNomenclatureEntity from './SaleNomenclatureEntity';

export interface OrderEntity {
    // Customer: number;
    // CustomerName: string;
    id: number;
    client: ClientEntity;
    dateWTZ: string;
    // Deleted: boolean;
    // Payments: {
    //     Amount: number;
    //     CheckNumber: string;
    //     Comment: string;
    //     FiscalNumber: string;
    //     FiscalSign: string;
    //     Positions: number[];
    // }[];
    // SaleNomenclatures: SABYSaleNomenclature[];
    saleNomenclatures: SaleNomenclatureEntity[];
    key: string;
    number: number;
    openedWTZ: string;
    sale: number;
    saleName: string;
    totalDiscount: number;
    totalPrice: number;
}
