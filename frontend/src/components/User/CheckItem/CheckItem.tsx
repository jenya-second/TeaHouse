import { openLink } from '@telegram-apps/sdk-react';
import styles from './CheckItem.module.scss';

export function CheckItem({
    date,
    link,
    cost,
}: {
    date: string;
    link: string;
    cost: number;
}) {
    const click = () => {
        openLink(link);
    };

    return (
        <div className={styles.wrapper}>
            <div>{date}</div>
            <div onClick={click}>
                <div className={styles.image} />
                <span>{'Заказ на сумму'}</span>
                <span>{cost + ' ₽'}</span>
            </div>
        </div>
    );
}
