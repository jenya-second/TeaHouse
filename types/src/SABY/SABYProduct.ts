export interface SABYProduct {
    attributes: {
        Прессовка: 'Да' | 'Нет';
        Размер: number;
    };
    name: string;
    cost: number;
    images: string[];
    isParent: boolean;
    description: string;
    description_simple: string;
    externalId: string;
    hierarchicalId: number;
    hierarchicalParent: number;
    id: number;
    indexNumber: number;
    nomNumber: string;
    unit: string;
    published: boolean;
    balance: number;
}

export default SABYProduct;
