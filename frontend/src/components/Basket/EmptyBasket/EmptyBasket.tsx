import styles from './EmptyBasket.module.scss';

export function EmptyBasket() {
    return (
        <div className={styles.main}>
            <div className={styles.image} />
            <span>Добавьте товары в заказ из каталога доставки</span>
        </div>
    );
}
