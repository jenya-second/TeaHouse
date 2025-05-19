import { OrderEntity } from './OrderEntity';
import OrderInProgressEntity from './OrderInProgressEntity';
import PromotionEntity from './PromotionEntity';
import TelegramUserEntity from './TelegramUserEntity';

export interface ClientEntity {
    id: number;
    uuid: string;
    name: string;
    phone: string;
    num: number;
    orders: OrderEntity[];
    ordersInProgress: OrderInProgressEntity[];
    tgUser: TelegramUserEntity;
    // promotion: PromotionEntity;
}

export default ClientEntity;
