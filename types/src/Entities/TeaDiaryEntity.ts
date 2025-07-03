import ClientEntity from './ClientEntity';
import ProductEntity from './ProductEntity';

export interface TeaDiaryEntity {
    id: number;
    impression: string;
    taste: string;
    smell: string;
    afterstate: string;
    rank: number;
    client: ClientEntity;
    product: ProductEntity;
}

export default TeaDiaryEntity;
