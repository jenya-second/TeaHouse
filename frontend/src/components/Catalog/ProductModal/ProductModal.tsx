import { useNavigate, useParams } from 'react-router';
import styles from './ProductModal.module.scss';
import { useEffect, useState } from 'react';
import { ProductEntity } from '@tea-house/types';
import { GetImagePath, GetProductByIdRequest } from '#utils/requests.js';
import { combineStyles } from '#utils/styles.js';
import { CircularProgress } from '@mui/material';
import { Counter } from '../Counter/Counter';
import { useAppDispatch, useAppSelector } from '#redux/index.js';
import { addProduct } from '#redux/basket.js';
import { BASKET_PATH } from '#utils/constants.js';

export function ProductModal() {
    const { productId, order } = useParams();
    const [product, setProduct] = useState<ProductEntity>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const countItemsInBasket = useAppSelector((state) => {
        return state.basket.value.length;
    });
    const countProduct = useAppSelector((state) => {
        if (!productId) return 0;
        const ind = state.basket.value.findIndex((val) => {
            return val.product.id === +productId;
        });
        return ind == -1 ? 0 : state.basket.value[ind].count;
    });
    useEffect(() => {
        if (!productId) {
            setProduct(undefined);
            return;
        }
        GetProductByIdRequest(+productId).then(setProduct);
    }, [productId]);

    return (
        <div
            className={combineStyles(
                styles.wrapper,
                productId ? styles.visible : styles.hidden,
            )}
        >
            {!product ? (
                <CircularProgress />
            ) : (
                <>
                    <div
                        className={styles.modalImage}
                        style={{
                            backgroundImage: `url(${GetImagePath(product.images[0]?.id)})`,
                        }}
                    />
                    <div className={styles.infoWrapper}>
                        {product?.name}
                        <br />
                        {product?.cost + ' ₽ / ' + product?.unit}
                        {order == 't' && (
                            <>
                                <div className={styles.recomendations}>
                                    <div className={styles.teapod} />
                                    Рекомендации по завариванию
                                </div>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: product.description,
                                    }}
                                />
                                <div className={styles.buttons}>
                                    <div
                                        className={combineStyles(
                                            styles.toOrder,
                                            countProduct == 0
                                                ? styles.full
                                                : styles.collapsed,
                                        )}
                                        onClick={() => {
                                            if (countProduct == 0) {
                                                dispatch(addProduct(product));
                                            } else {
                                                navigate(BASKET_PATH);
                                            }
                                        }}
                                    >
                                        {countProduct == 0
                                            ? 'Добавить в заказ'
                                            : `Просмотр заказа (${countItemsInBasket})`}
                                    </div>
                                    <Counter product={product} />
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
