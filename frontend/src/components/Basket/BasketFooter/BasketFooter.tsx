import { useNavigate } from 'react-router';
import styles from './BasketFooter.module.scss';

export function BasketFooter({ cost }: { cost: number }) {
    const navigate = useNavigate();
    return (
        <div className={styles.wrapper}>
            <div className={styles.text}>Сумма заказа: {cost + ' ₽'}</div>
            <div
                onClick={() => navigate('/processing')}
                className={styles.button}
            >
                К ОФОРМЛЕНИЮ
            </div>
        </div>
    );
}
