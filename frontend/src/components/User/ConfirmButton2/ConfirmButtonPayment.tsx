import styles from './ConfirmButtonPayment.module.scss';
import { useEffect, useRef, useState } from 'react';
import { getOrderStateByKey, GetPaymentLink } from '#utils/requests.js';
import { initData, openLink, useSignal } from '@telegram-apps/sdk-react';

export function ConfirmButtonPayment({ orderKey }: { orderKey: string }) {
    const [link, setLink] = useState('');
    const s = useRef<HTMLAnchorElement>(null);
    const interval = useRef<NodeJS.Timeout>(undefined);
    const init = useSignal(initData.raw);

    useEffect(() => {
        if (!init) return;
        GetPaymentLink(orderKey).then(setLink);
        interval.current = setInterval(
            () => getOrderStateByKey(orderKey).then(console.log),
            5000,
        );
        return () => clearInterval(interval.current);
    }, [init]);
    // ждем оплату
    // при появлении хоть какой-то, ставим обработку заказа банком
    // парсим сообщение и при успешной оплате заменяем сообщением об успешной оплате
    // добавляем в локальное хранилище информацию об успешной оплаты заказа
    // при входе в историю заказов проверять локальное хранилище
    // при ошибке оплаты выводить сообщение об ошибке

    const onClick = async () => {
        // s.current?.click();
        openLink(link);
    };

    return (
        <div className={styles.wrapper}>
            <div onClick={onClick} className={styles.button}>
                {'ОПЛАТИТЬ'}
            </div>
            <a ref={s} href={link} hidden />
        </div>
    );
}
