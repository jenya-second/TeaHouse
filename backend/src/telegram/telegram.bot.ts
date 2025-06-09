import { Injectable } from '@nestjs/common';
import { TelegramUser } from 'src/database/entities';
import { TelegramUserService } from 'src/database/services';
import {
    Message,
    ReplyKeyboardMarkup,
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
            try {
                this.sendMessage({
                    chat_id: message.chat.id,
                    text: 'Перед использованием разрешите доступ к номеру телефона по кнопке ниже.',
                    reply_markup: sendContactReply,
                });
            } catch (e) {
                console.log(e);
            }
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
                this.sendMessage({
                    chat_id: message.chat.id,
                    text: 'Сосал?',
                    reply_markup: sendContactReply,
                });
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
                } as TelegramUser;
                await this.telegramUserService.saveOne(contact);
                this.sendMessage({
                    chat_id: message.chat.id,
                    text: 'Вы зарегистрировались в системе чайной!',
                    reply_markup: { remove_keyboard: true },
                });
            } else {
                this.sendMessage({
                    chat_id: message.chat.id,
                    text: 'Вы уже зарегестированы в системе чайной!',
                    reply_markup: { remove_keyboard: true },
                });
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
}
