import { ProductEntity } from '@tea-house/types';
import styles from './CatalogItemSmall.module.scss';
import { combineStyles } from '#utils/styles.js';
import { GetImagePath } from '#utils/requests.js';
import { CounterCommon } from '../Counter/CounterCommon';
import { memo } from 'react';
import { CounterPress } from '../Counter/CounterPress';
import { useAppSelector } from '#redux/index.js';

export const CatalogItemSmall = memo(function CatalogItemSmall({
    product,
    showCounter,
}: {
    product: ProductEntity;
    showCounter: boolean;
}) {
    const countProduct = useAppSelector((state) => {
        if (!product.id) return 0;
        const ind = state.basket.value.findIndex((val) => {
            return val.product.id === product.id;
        });
        return ind == -1 ? 0 : state.basket.value[ind].count;
    });
    const faceImage = product?.images[0];
    const imgPath = GetImagePath(faceImage?.id);
    const counter = product.press ? (
        <CounterPress product={product} modal={false} />
    ) : (
        <CounterCommon product={product} modal={false} />
    );
    const cost =
        countProduct == 0
            ? `${product.cost} ₽ / ${product.unit}`
            : (product.press
                  ? (countProduct * product.cost * product.pressAmount) /
                    (product.pressAmount >= 200 ? 2 : 1)
                  : countProduct * product.cost * 25) + ' ₽';
    return (
        <div className={combineStyles(styles.item, styles.outShadow)}>
            <div
                className={styles.image}
                style={{
                    backgroundImage: `url(${imgPath != '' ? imgPath : '/Logo.png'})`,
                }}
            />
            <div className={styles.infoWrapper}>
                <div>{product.name}</div>
                <div className={styles.bottomWrapper}>
                    <div>{cost}</div>
                    {showCounter && counter}
                </div>
            </div>
        </div>
    );
});
