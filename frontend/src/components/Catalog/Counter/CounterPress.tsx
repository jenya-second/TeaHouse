import { ProductEntity } from '@tea-house/types';
import styles from './Counter.module.scss';
import { combineStyles } from '#utils/styles.js';
import { useAppDispatch, useAppSelector } from '#redux/index.js';
import { MouseEventHandler } from 'react';
import { addProduct, deleteProduct } from '#redux/basket.js';
import { CounterSolid } from './CounterSolid';
import { usePopUp } from '#components/Common/PopUp/PopUp.js';

export function CounterPress({
    product,
    modal,
}: {
    product: ProductEntity;
    modal: boolean;
}) {
    const dispatch = useAppDispatch();
    const [popUp, showMessage] = usePopUp();
    const countRedux = useAppSelector((state) => {
        const ind = state.basket.value.findIndex((val) => {
            return val.product.id === product.id;
        });
        return ind == -1 ? 0 : state.basket.value[ind].count;
    });
    const theWord = modal ? 'В заказ' : 'Выбрать';
    const splittable = product.pressAmount >= 200;
    const countInGr = product.pressAmount / (splittable ? 2 : 1);
    const max = Math.floor(product.balance / countInGr);

    const onPlus: MouseEventHandler = () => {
        if (max <= countRedux)
            showMessage(
                'По данной позиции нет большего объёма, обратитесь в чайную для индивидуального заказа.',
            );
        dispatch(addProduct(product));
    };
    const onMinus: MouseEventHandler = () => {
        dispatch(deleteProduct(product));
    };

    const ret = modal ? (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
                className={combineStyles(
                    styles.paprikaFont,
                    styles.counter,
                    countRedux != 0 ? '' : styles.hid,
                )}
                id="counter"
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
                <div className={splittable ? styles.half : styles.full} />
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
            <div className={styles.bottomText}>
                {Math.floor(
                    (product.pressAmount * countRedux) / (splittable ? 2 : 1),
                ) + ' гр'}
            </div>
        </div>
    ) : (
        <CounterSolid
            count={Math.floor(
                (product.pressAmount * countRedux) / (splittable ? 2 : 1),
            )}
            product={product}
        />
    );

    return (
        <>
            {popUp}
            {countRedux == 0 ? (
                <div
                    className={combineStyles(
                        styles.paprikaFont,
                        styles.counter,
                        styles.yellow,
                    )}
                    onClick={modal ? onPlus : () => undefined}
                >
                    <span>{theWord}</span>
                </div>
            ) : (
                ret
            )}
        </>
    );
}
