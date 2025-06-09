import { Injectable, NestMiddleware } from '@nestjs/common';
import { createHmac } from 'crypto';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TelegramAuthMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        if (!req.headers.authorization) {
            next('No init data');
            return;
        }
        if (this.checkInitData(req)) {
            next();
        } else {
            next('Wrong init data');
        }
    }

    private checkInitData(req: Request): boolean {
        const initData = new URLSearchParams(req.headers.authorization);
        const hash = initData.get('hash');
        const dataToCheck: string[] = [];
        initData.sort();
        initData.forEach(
            (val, key) => key !== 'hash' && dataToCheck.push(`${key}=${val}`),
        );
        const secret = createHmac('sha256', 'WebAppData')
            .update(process.env.BOT_TOKEN)
            .digest();
        const _hash = createHmac('sha256', secret)
            .update(dataToCheck.join('\n'))
            .digest('hex');
        return hash === _hash;
    }
}
