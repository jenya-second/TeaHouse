import { OrderEntity } from './OrderEntity';
import OrderInProgressEntity from './OrderInProgressEntity';
import PromotionEntity from './PromotionEntity';

export interface ClientEntity {
    id: number;
    uuid: string;
    name: string;
    phone: string;
    num: number;
    orders: OrderEntity[];
    ordersInProgress: OrderInProgressEntity[];
    // promotion: PromotionEntity;
}

export default ClientEntity;
