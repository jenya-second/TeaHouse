export interface SABYOrder {
    Customer: number;
    CustomerName: string;
    DateWTZ: string; //Дата продажи
    Deleted: boolean;
    DiscountInfo: {
        Name: string;
        PercentValue: number;
        Value: number;
    }[];
    Payments: {
        Amount: number;
        CheckNumber: string;
        Comment: string;
        ClosedWTZ: string;
        FiscalNumber: string;
        FiscalSign: string;
        KKTFiscalNumber: string;
        KKTNumber: string;
        Nonfiscal: string;
        OpenedWTZ: string;
        Positions: number[];
    }[];
    SaleNomenclatures: SABYSaleNomenclature[];
    Key: string;
    Number: number;
    OpenedWTZ: string; //Дата создания продажи
    Sale: number;
    SaleName: string;
    TotalDiscount: number;
    TotalPrice: number;
}

export interface SABYSaleNomenclature {
    CatalogPrice: number;
    CheckDiscount: number;
    CheckPrice: number;
    CheckSum: number;
    Key: string;
    ManualPrice: number;
    Name: string;
    Nomenclature: number;
    NomenclatureNumber: string;
    NomenclatureUUID: string;
    Number: number;
    Quantity: number;
    TotalDiscount: number;
    TotalPrice: number;
    TotalCost: number;
}

export default SABYOrder;
