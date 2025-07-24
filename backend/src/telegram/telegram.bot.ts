import { Injectable } from '@nestjs/common';
import { OrderInProgress, TelegramUser } from 'src/database/entities';
import { TelegramUserService } from 'src/database/services';
import {
    ForceReply,
    InlineKeyboardMarkup,
    Message,
    ReplyKeyboardMarkup,
    ReplyKeyboardRemove,
    TelegramBot,
} from 'typescript-telegram-bot-api';

@Injectable()
export class OichaiBot extends TelegramBot {
    constructor(
        botToken: string,
        private readonly telegramUserService: TelegramUserService,
    ) {
        super({ botToken: botToken });

        const sendContactReply: ReplyKeyboardMarkup = {
            one_time_keyboard: true,
            keyboard: [[{ text: 'Отправить номер', request_contact: true }]],
        };

        const react = (message: NonNullable<Message>, emoji: string) => {
            this.setMessageReaction({
                chat_id: message.chat.id,
                message_id: message.message_id,
                reaction: [{ type: 'emoji', emoji: emoji }],
            });
        };

        this.on('message:text', (message) => {
            if (message.text != '/start') {
                react(message, '🤔');
                return;
            }
            this.SendMessageToUser(
                'Перед использованием разрешите доступ к номеру телефона по кнопке ниже.',
                message.chat.id,
                sendContactReply,
            );
        });

        this.on('message', async (message) => {
            console.log(message);
        });

        this.on('message:photo', (message) => {
            react(message, '🗿');
        });

        this.on('message:animation', (message) => {
            react(message, '🗿');
        });

        this.on('message:contact', async (message) => {
            if (message.contact.user_id != message.from.id) {
                this.SendMessageToUser(
                    'Сосал?',
                    message.chat.id,
                    sendContactReply,
                );
                return;
            }
            const tgUser = await this.telegramUserService.findOneByTgId(
                message.from.id,
            );

            if (!tgUser) {
                const contact = {
                    tgId: message.contact.user_id,
                    firstName: message.contact.first_name,
                    lastName: message.contact.last_name,
                    phone: message.contact.phone_number,
                    username: message.from.username,
                    chatId: '' + message.chat.id,
                } as TelegramUser;
                await this.telegramUserService.saveOne(contact);
                this.SendMessageToUser(
                    'Вы зарегистрировались в системе чайной!',
                    message.chat.id,
                    { remove_keyboard: true },
                );
            } else {
                this.SendMessageToUser(
                    'Вы уже зарегистрированы в системе чайной!',
                    message.chat.id,
                    { remove_keyboard: true },
                );
            }
            this.setChatMenuButton({
                chat_id: message.chat.id,
                menu_button: {
                    type: 'web_app',
                    text: 'OPEN',
                    web_app: { url: 'https://oichai.maslo-spb.ru/' },
                },
            });
        });
    }

    SendMessageAboutOrder(order: OrderInProgress) {
        const d = order.datetime.split(' ')[0].split('-');
        const date = `${d[2]}.${d[1]}.${+d[0] - 1}`;
        this.SendMessageToUser(
            `Ваш заказ от ${date} проверен и доступен для оплаты.`,
            order.client.tgUser.chatId,
        );
    }

    async SendMessageToUser(
        text: string,
        clientChatId: number | string,
        reply_markup?:
            | InlineKeyboardMarkup
            | ReplyKeyboardMarkup
            | ReplyKeyboardRemove
            | ForceReply,
    ) {
        try {
            await this.sendMessage({
                chat_id: clientChatId,
                text: text,
                reply_markup: reply_markup,
            });
        } catch (e) {}
    }
}
