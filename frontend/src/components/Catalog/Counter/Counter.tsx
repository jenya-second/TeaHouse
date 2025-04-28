import { useAppDispatch, useAppSelector } from '#redux/index.js';
import { combineStyles } from '#utils/styles.js';
import { ProductEntity } from '@tea-house/types';
import styles from './Counter.module.scss';
import { addProduct, deleteProduct } from '#redux/basket.js';

export function Counter({ product }: { product: ProductEntity }) {
    const dispatch = useAppDispatch();
    const countRedux = useAppSelector((state) => {
        const ind = state.basket.value.findIndex((val) => {
            return val.product.id === product.id;
        });
        return ind == -1 ? 0 : state.basket.value[ind].count;
    });
    return (
        <div
            className={combineStyles(
                styles.paprikaFont,
                styles.counter,
                countRedux != 0 ? '' : styles.hid,
            )}
            id="counter"
            onClick={(e) => e.stopPropagation()}
        >
            <div
                className={combineStyles(styles.minus, styles.icon)}
                id="click_minus"
                onClick={() => {
                    dispatch(deleteProduct(product));
                }}
            />
            {countRedux != 0 && countRedux}
            <div
                className={combineStyles(styles.plus, styles.icon)}
                id="click_plus"
                onClick={() => {
                    dispatch(addProduct(product));
                }}
            />
        </div>
    );
}
