import ClientEntity from './ClientEntity';

export interface TelegramUserEntity {
    id: number;
    phone: string;
    username: string;
    firstName: string;
    lastName: string;
    tgId: number;
    chatId: string;
    SABYUser: ClientEntity;
}

export default TelegramUserEntity;
