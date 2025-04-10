export interface SABYDelivery {
    product: 'delivery';
    pointId: 244;
    comment?: string;
    customer: {
        name?: string;
        phone: string;
    };
    datetime: string;
    promocode?: string;
    nomenclatures: {
        nomNumber: string;
        count: number;
        cost?: number;
        priceListId: 10;
    }[];
    delivery: {
        isPickup: boolean;
        addressJSON?: string;
        addressFull?: string;
        paymentType: 'card' | 'online' | 'cash';
        shopURL?: string;
        successURL?: string;
        errorURL?: string;
    };
}

export default SABYDelivery;
