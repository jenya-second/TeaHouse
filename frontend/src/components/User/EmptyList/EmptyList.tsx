import { combineStyles } from '#utils/styles.js';
import styles from './EmptyList.module.scss';

export function EmptyListNewOrders() {
    return (
        <>
            <div className={combineStyles(styles.i, styles.newOrders)} />
            <div className={styles.textWrap}>
                <ul>
                    <li>Сформируйте заказ</li>
                    <li>Дождитесь обработки</li>
                    <li>Оплатите подтвержденный заказ</li>
                </ul>
            </div>
        </>
    );
}

export function EmptyListOrdersInProgress({ count }: { count: number }) {
    return (
        <>
            <div className={combineStyles(styles.i, styles.ordersInProgress)} />
            <div className={styles.textWrap}>
                Заказов в обработке: {count}
                <ul>
                    <li>Дождитесь обработки</li>
                    <li>Оплатите подтвержденный заказ</li>
                </ul>
            </div>
        </>
    );
}

export function EmptyListCompletedOrders() {
    return (
        <>
            <div className={combineStyles(styles.i, styles.completeOrders)} />
            <div className={styles.textWrap}>
                <div>
                    Ваша история заказов пока пустая - сформируйте и оплатите
                    заказ для её пополнения
                </div>
            </div>
        </>
    );
}
