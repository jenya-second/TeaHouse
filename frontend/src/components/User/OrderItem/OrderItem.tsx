import { OrderEntity, OrderInProgressEntity } from '@tea-house/types';
import styles from './OrderItem.module.scss';
import { combineStyles } from '#utils/styles.js';

export function OrderItem({
    type,
    order,
    cor = false,
}: {
    type: 1 | 2 | 3;
    order: OrderEntity | OrderInProgressEntity;
    cor?: boolean;
}) {
    const date = (
        (order as OrderEntity).dateWTZ ||
        (order as OrderInProgressEntity).datetime
    )
        .split(' ')[0]
        .split('-');
    if ((order as OrderInProgressEntity).datetime) date[0] = `${+date[0] - 1}`;
    let iconImage: string;
    switch (type) {
        case 1:
            iconImage = styles.newOrders;
            break;
        case 2:
            iconImage = styles.ordersInProgress;
            break;
        default:
            iconImage = styles.completeOrders;
    }

    return (
        <>
            <div
                className={styles.date}
            >{`${date[2]}.${date[1]}.${+date[0]}`}</div>
            <div className={combineStyles(styles.item, cor ? styles.cor : '')}>
                <div className={combineStyles(styles.icon, iconImage)} />
                <div className={styles.text}>
                    Заказ на сумму <span>{order.totalPrice + ' ₽'}</span>
                </div>
                {cor && (
                    <div className={styles.correct}>
                        *Присутствуют корректировки
                    </div>
                )}
            </div>
        </>
    );
}
