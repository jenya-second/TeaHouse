import { combineStyles } from '#utils/styles.js';
import styles from './CostBar.module.scss';

export function CostBar({
    cost,
    delivery,
}: {
    cost: number;
    delivery?: number;
}) {
    return (
        <div className={combineStyles(styles.main, styles.outShadow)}>
            <div className={styles.row}>
                <span>Сумма заказа:</span>
                <span>{cost + ' ₽'}</span>
            </div>
            <div className={styles.row}>
                <span>Доставка:</span>
                <span className={delivery != undefined ? '' : styles.text}>
                    {delivery != undefined
                        ? delivery + ' ₽'
                        : 'Стоимость будет известна после обработки заказа'}
                </span>
            </div>
            <div className={styles.row}>
                <span>Итого:</span>
                <span>
                    {cost + (delivery != undefined ? delivery : 0) + ' ₽'}
                </span>
            </div>
        </div>
    );
}
