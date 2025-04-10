import { OrderEntity } from './OrderEntity';

export interface ClientEntity {
    id: number;
    uuid: string;
    name: string;
    phone: string;
    num: number;
    orders: OrderEntity[];
}

export default ClientEntity;
