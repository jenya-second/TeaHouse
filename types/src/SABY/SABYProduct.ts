export type SABYProduct = {
    attributes?: {
        Прессовка: 'Да' | 'Нет';
    };
    name?: string;
    cost?: number;
    images?: string[];
    isParent?: boolean;
    description?: string;
    description_simple?: string;
    externalId?: string;
    hierarchicalId?: number;
    hierarchicalParent?: number;
    id?: number;
    indexNumber?: number;
    nomNumber?: string;
    unit: string;
    published: boolean;
};

export default SABYProduct;
