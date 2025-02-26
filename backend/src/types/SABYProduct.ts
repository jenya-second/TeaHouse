export type SABYProduct = {
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
    unit?: string;
};

export default SABYProduct;
