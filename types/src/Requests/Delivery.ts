export interface Delivery {
    client: {
        phone: string;
        name: string;
        surname: string;
        lastname: string;
    };
    isPickup: boolean;
    nomenclatures: {
        nomNumber: string;
        count: number;
    }[];
    delivery: {
        address: string;
        comment: string;
    };
}
