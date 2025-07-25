import { SaleNomenclatureEntity } from '@tea-house/types';
import styles from './ProductItem.module.scss';
import { combineStyles } from '#utils/styles.js';
import { GetImagePathLowRes } from '#utils/requests.js';
import { memo } from 'react';
import { CounterSolid } from '#components/Catalog/Counter/CounterSolid.js';

export const ProductItem = memo(function ProductItem({
    nom,
    nulled = false,
    delivery = false,
}: {
    nom: SaleNomenclatureEntity;
    nulled?: boolean;
    delivery?: boolean;
}) {
    const faceImage = nom.product?.images[0];
    const imgPath = GetImagePathLowRes(faceImage?.id);
    return (
        <div className={combineStyles(styles.item, styles.outShadow)}>
            <div
                className={styles.image}
                style={{
                    backgroundImage: `url(${imgPath != '' ? imgPath : '/Logo.png'})`,
                }}
            />
            <div className={styles.infoWrapper}>
                <div>{nom.product.name}</div>
                <div className={styles.bottomWrapper}>
                    <div>{nom.totalPrice + ' ₽'}</div>
                    <CounterSolid
                        count={nom.quantity}
                        product={nom.product}
                        delivery={delivery}
                        nulled={nulled}
                    />
                </div>
            </div>
        </div>
    );
});

export const ProductChangedItem = memo(function ProductChangedItem({
    prevNom,
    curNom,
    nulled,
}: {
    prevNom: SaleNomenclatureEntity;
    curNom: SaleNomenclatureEntity;
    nulled: boolean;
}) {
    const faceImage = prevNom.product?.images[0];
    const imgPath = GetImagePathLowRes(faceImage?.id);
    return (
        <>
            <div
                className={combineStyles(
                    styles.item,
                    styles.outShadow,
                    styles.before,
                )}
            >
                <div className={styles.podpiska}>Было</div>
                <div
                    className={styles.image}
                    style={{
                        backgroundImage: `url(${imgPath != '' ? imgPath : '/Logo.png'})`,
                    }}
                />
                <div className={styles.infoWrapper}>
                    <div>{prevNom.product.name}</div>
                    <div className={styles.bottomWrapper}>
                        <div>{prevNom.totalPrice + ' ₽'}</div>
                        <CounterSolid
                            count={prevNom.quantity}
                            product={prevNom.product}
                        />
                    </div>
                </div>
            </div>
            <div
                className={combineStyles(
                    styles.item,
                    styles.outShadow,
                    styles.after,
                )}
            >
                <div className={styles.podpiska}>Стало</div>
                <div
                    className={styles.image}
                    style={{
                        backgroundImage: `url(${imgPath != '' ? imgPath : '/Logo.png'})`,
                    }}
                />
                <div className={styles.infoWrapper}>
                    <div>{curNom.product.name}</div>
                    <div className={styles.bottomWrapper}>
                        <div>{!nulled ? curNom.totalPrice + ' ₽' : ''}</div>
                        <CounterSolid
                            count={curNom.quantity}
                            product={curNom.product}
                            nulled={nulled}
                        />
                    </div>
                </div>
            </div>
        </>
    );
});
