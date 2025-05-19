import { Module } from '@nestjs/common';
import { telegram_bot } from 'src/constants';
import { OichaiBot } from './telegram.bot';
import { DatabaseModule } from 'src/database/db.module';
import { TelegramUserService } from 'src/database/services';

@Module({
    imports: [DatabaseModule],
    providers: [
        {
            provide: telegram_bot,
            useFactory: async (telegramUserService: TelegramUserService) => {
                const bot = new OichaiBot(
                    process.env.BOT_TOKEN,
                    telegramUserService,
                );
                await bot.startPolling();
                return bot;
            },
            inject: [TelegramUserService],
        },
    ],
    exports: [telegram_bot],
})
export class TelegramBotModule {}
