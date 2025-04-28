import ClientEntity from './ClientEntity';

export interface PromotionEntity {
    id: number;
    name: string;
    discountPercentage: number;
    clients: ClientEntity[];
}

export default PromotionEntity;
