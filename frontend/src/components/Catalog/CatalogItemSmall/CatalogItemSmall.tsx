import { ProductEntity } from '@tea-house/types';
import styles from './CatalogItemSmall.module.scss';
import { combineStyles } from '#utils/styles.js';
import { GetImagePath } from '#utils/requests.js';
import { Counter } from '../Counter/Counter';
import { useNavigate, useParams } from 'react-router';

export function CatalogItemSmall({ product }: { product: ProductEntity }) {
    const faceImage = product?.images[0];
    const navigate = useNavigate();
    const { order } = useParams();
    return (
        <>
            <div
                className={combineStyles(styles.item, styles.outShadow)}
                onClick={() => {
                    navigate(`./${product.id}`);
                }}
            >
                <div
                    className={styles.image}
                    style={{
                        backgroundImage: `url(${GetImagePath(faceImage?.id)})`,
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
        </>
    );
}
