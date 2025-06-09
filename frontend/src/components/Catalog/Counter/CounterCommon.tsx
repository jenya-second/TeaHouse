import { useAppDispatch, useAppSelector } from '#redux/index.js';
import { combineStyles } from '#utils/styles.js';
import { ProductEntity } from '@tea-house/types';
import styles from './Counter.module.scss';
import { addProduct, deleteProduct } from '#redux/basket.js';
import { MouseEventHandler } from 'react';
import { usePopUp } from '#components/Common/PopUp/PopUp.js';

export function CounterCommon({
    product,
    modal,
}: {
    product: ProductEntity;
    modal: boolean;
}) {
    const dispatch = useAppDispatch();
    const countRedux = useAppSelector((state) => {
        const ind = state.basket.value.findIndex((val) => {
            return val.product.id === product.id;
        });
        return ind == -1 ? 0 : state.basket.value[ind].count;
    });
    const [popUp, showMessage] = usePopUp();
    const countInGr = 25;
    const max = Math.floor(product.balance / countInGr);
    const onCounter: MouseEventHandler = (e) => {
        e.stopPropagation();
    };
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

    return (
        <>
            {popUp}
            {modal && countRedux == 0 ? (
                <div
                    className={combineStyles(
                        styles.paprikaFont,
                        styles.counter,
                        styles.yellow,
                    )}
                    onClick={onPlus}
                >
                    <span>В заказ</span>
                </div>
            ) : (
                <div
                    className={combineStyles(
                        styles.paprikaFont,
                        styles.counter,
                        countRedux != 0 ? '' : styles.hid,
                    )}
                    id="counter"
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
                        {countRedux != 0 ? (
                            <>{countRedux * countInGr} гр</>
                        ) : (
                            ''
                        )}
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
            )}
        </>
    );
}
