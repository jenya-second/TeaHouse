import { ProductEntity } from '@tea-house/types';
import styles from './CatalogItemSmall.module.scss';
import { combineStyles } from '#utils/styles.js';
import { GetImagePath } from '#utils/requests.js';
import { Counter } from '../Counter/Counter';
import { memo } from 'react';

export const CatalogItemSmall = memo(function CatalogItemSmall({
    product,
    navigateTo,
}: {
    product: ProductEntity;
    navigateTo: string;
}) {
    const faceImage = product?.images[0];
    const imgPath = GetImagePath(faceImage?.id);
    const order = navigateTo.split('/')[2];
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
                    <div>
                        {product.cost + ' ₽'} / {product.unit}
                    </div>
                    {order == 't' && <Counter product={product} />}
                </div>
            </div>
        </div>
    );
});
