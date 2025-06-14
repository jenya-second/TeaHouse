import styles from './ConfirmButtonPayment.module.scss';
import { useEffect, useRef, useState } from 'react';
import { GetPaymentLink } from '#utils/requests.js';
import { initData, openLink, useSignal } from '@telegram-apps/sdk-react';

export function ConfirmButtonPayment({ orderKey }: { orderKey: string }) {
    const [link, setLink] = useState('');
    const s = useRef<HTMLAnchorElement>(null);
    const init = useSignal(initData.raw);

    useEffect(() => {
        if (!init) return;
        GetPaymentLink(orderKey).then(setLink);
    }, [init]);

    const onClick = async () => {
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
