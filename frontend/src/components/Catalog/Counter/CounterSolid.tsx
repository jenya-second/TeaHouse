import { ProductEntity } from '@tea-house/types';
import styles from './Counter.module.scss';
import { combineStyles } from '#utils/styles.js';

export function CounterSolid({
    product,
    count,
    nulled = false,
    delivery = false,
}: {
    product: ProductEntity;
    count: number;
    nulled?: boolean;
    delivery?: boolean;
}) {
    const press = product.press;
    const splittable = product.pressAmount >= 200;
    const full = Math.floor(count / product.pressAmount);
    const half = (count % product.pressAmount) / product.pressAmount > 0.3;
    const circles = splittable ? (
        <>
            {full != 0 && (
                <>
                    <div className={styles.full} />
                    {`x${full}`}
                </>
            )}
            {full != 0 && half && <div className={styles.split}>|</div>}
            {half && (
                <>
                    <div className={styles.half} />
                    {`x${+half}`}
                </>
            )}
        </>
    ) : (
        <>
            <div className={styles.full} />
            {`x${full}`}
        </>
    );

    if (nulled || delivery) {
        return (
            <div
                className={combineStyles(styles.paprikaFont, styles.counter)}
                id="counter"
            >
                <div className={nulled ? styles.nulled : styles.deliv}>
                    {nulled ? 'АННУЛИРОВАН' : 'Услуга'}
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
                className={combineStyles(
                    styles.paprikaFont,
                    styles.counter,
                    count != 0 ? '' : styles.hid,
                )}
                id="counter"
            >
                {press && <div className={styles.circles}>{circles}</div>}
                {!press && <span>{`${count} гр`}</span>}
            </div>
            {press && <div className={styles.bottomText}>{`${count} гр`}</div>}
        </div>
    );
}
