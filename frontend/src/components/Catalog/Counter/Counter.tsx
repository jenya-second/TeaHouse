import { useAppDispatch, useAppSelector } from '#redux/index.js';
import { combineStyles } from '#utils/styles.js';
import { ProductEntity } from '@tea-house/types';
import styles from './Counter.module.scss';
import { addProduct, deleteProduct } from '#redux/basket.js';
import { MouseEventHandler, useRef } from 'react';

export function Counter({ product }: { product: ProductEntity }) {
    const dispatch = useAppDispatch();
    const countRedux = useAppSelector((state) => {
        const ind = state.basket.value.findIndex((val) => {
            return val.product.id === product.id;
        });
        return ind == -1 ? 0 : state.basket.value[ind].count;
    });
    const press = product.press;
    const countInGr = press ? product.pressAmount : 25;
    const max = product.balance / countInGr;
    const counter = useRef<HTMLDivElement>(null);
    const onCounter: MouseEventHandler = (e) => {
        if (press) return; //надо выходить из функции, чтобы при прессовке мы проваливались в окно товара
        if (countRedux == 0) dispatch(addProduct(product));
        e.stopPropagation();
    };
    const onPlus: MouseEventHandler = () => {
        if (countRedux == 0) return;
        dispatch(addProduct(product));
    };
    const onMinus: MouseEventHandler = () => {
        if (countRedux == 0) return;
        dispatch(deleteProduct(product));
    };

    return (
        <div
            className={combineStyles(
                styles.paprikaFont,
                styles.counter,
                countRedux != 0 ? '' : styles.hid,
            )}
            id="counter"
            ref={counter}
            onClick={onCounter}
        >
            <div
                className={combineStyles(
                    styles.minus,
                    styles.icon,
                    countRedux == 1 ? styles.red : '',
                )}
                id="click_minus"
                onClick={onMinus}
            />
            <span>
                {countRedux != 0 ? <>{countRedux * countInGr} гр</> : 'Выбрать'}
            </span>
            <div
                className={combineStyles(
                    styles.plus,
                    styles.icon,
                    countRedux >= max ? styles.end : '',
                )}
                id="click_plus"
                onClick={onPlus}
            />
        </div>
    );
}
