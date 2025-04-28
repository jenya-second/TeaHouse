export interface SABYOrderInProgress {
    id: string;
    key: string;
    saleKey: string;
    number: number;
    pointId: number;
    comment: string;
    customer: {
        blacklisted: boolean;
        name: string;
        phone: string;
    };
    datetime: string;
    nomenclatures: {
        cost: number;
        count: number;
        externalId: string;
        name: string;
        nomNumber: string;
        rowNumber: number;
        totalPrice: number;
        totalSum: number;
    }[];
    delivery: {
        address: string;
        addressJSON: string;
        isPickup: boolean;
        paymentType: number;
    };
    paymentType: number;
    totalPrice: number;
    totalSum: number;
    totalDiscount: number;
}

export default SABYOrderInProgress;
