import { Link, useLocation, useNavigate, useParams } from 'react-router';
import styles from './ProductModal.module.scss';
import { useEffect, useState } from 'react';
import { ProductEntity } from '@tea-house/types';
import { GetImagePath, GetProductById } from '#utils/requests.js';
import { combineStyles } from '#utils/styles.js';
import { Badge, CircularProgress } from '@mui/material';
import { CounterCommon } from '../Counter/CounterCommon';
import { useAppSelector } from '#redux/index.js';
import { BASKET_PATH } from '#utils/constants.js';
import { CounterPress } from '../Counter/CounterPress';
import { TeaDiaryWidget } from '../TeaDiaryWidget/TeadDiaryWidget';

export function ProductModal() {
    const { productId } = useParams();
    const [product, setProduct] = useState<ProductEntity>();
    const navigate = useNavigate();
    const location = useLocation().pathname.split('/');
    const canAdd = location.includes('basket') || location.includes('t');
    // console.log(location);
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
    const cost =
        product &&
        (countProduct == 0
            ? ''
            : (product.press
                  ? (countProduct * product.cost * product.pressAmount) /
                    (product.pressAmount >= 200 ? 2 : 1)
                  : countProduct * product.cost * 25) + ' ₽');
    const counter =
        product &&
        (product.press ? (
            <CounterPress product={product} modal={true} />
        ) : (
            <CounterCommon product={product} modal={true} />
        ));

    useEffect(() => {
        if (!productId) {
            setProduct(undefined);
            return;
        }
        GetProductById(+productId).then(setProduct);
    }, [productId]);

    return (
        <>
            <div
                className={combineStyles(
                    styles.blur,
                    productId ? styles.blurVisible : styles.hidden,
                )}
                onClick={() => navigate(-1)}
            />
            <div
                className={combineStyles(
                    styles.modal,
                    productId ? styles.visible : styles.hidden,
                )}
            >
                <div className={styles.wrapper}>
                    {!product ? (
                        <CircularProgress />
                    ) : (
                        <>
                            <ModalImage product={product} withCount={canAdd} />
                            {canAdd && product.press && (
                                <PressViewItem
                                    count={countProduct}
                                    product={product}
                                />
                            )}
                            {product.category?.parentCategory?.name ==
                                'Чай развесной*' && (
                                <>
                                    <TeaDiaryWidget
                                        editable={location.includes('tea')}
                                        productId={+(productId || -1)}
                                    />
                                    <RecomendationsItem product={product} />
                                </>
                            )}
                        </>
                    )}
                </div>
                {canAdd && (
                    <div className={styles.footer}>
                        <div style={{ flex: 1.5 }}>{cost}</div>
                        <div style={{ flex: 0.7 }}>
                            <Badge
                                max={9}
                                badgeContent={countItemsInBasket}
                                color="success"
                            >
                                <Link
                                    to={BASKET_PATH}
                                    className={combineStyles(
                                        styles.button,
                                        styles.outShadow,
                                    )}
                                >
                                    <img
                                        className={styles.navImg}
                                        src={'/order.svg'}
                                    />
                                </Link>
                            </Badge>
                        </div>
                        <div style={{ flex: 1.5 }}>{counter}</div>
                    </div>
                )}
            </div>
        </>
    );
}

function ModalImage({
    product,
    withCount,
}: {
    product: ProductEntity;
    withCount: boolean;
}) {
    const imageSrc = GetImagePath(product.images[0]?.id);
    return (
        <div className={styles.imageWrapper}>
            <img src={imageSrc == '' ? '/Logo.png' : imageSrc} />
            <span>
                <div>{product.name}</div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                >
                    <div>{product?.cost + ' ₽ / ' + product?.unit}</div>
                    {withCount && (
                        <div
                            style={{
                                flex: 1,
                                textAlign: 'center',
                            }}
                        >{`Остаток: ${product.balance} ${product.unit}`}</div>
                    )}
                </div>
            </span>
        </div>
    );
}

function RecomendationsItem({ product }: { product: ProductEntity }) {
    if (!product.description)
        return (
            <div className={styles.item}>
                <div className={styles.emptyRecomendations}>
                    <div className={styles.bigTeapod} />
                    <span>
                        {
                            'Здесь должны быть рекомендации по завариванию. Скоро мы их заполним :)'
                        }
                    </span>
                </div>
            </div>
        );
    return (
        <div className={styles.item}>
            <div className={styles.infoWrapper}>
                <div className={styles.recomendations}>
                    <div className={styles.teapod} />
                    Рекомендации по завариванию
                </div>
                <div
                    dangerouslySetInnerHTML={{
                        __html: product.description,
                    }}
                />
            </div>
        </div>
    );
}

function PressViewItem({
    product,
    count,
}: {
    product: ProductEntity;
    count: number;
}) {
    const splittable = product.pressAmount >= 200;
    const count1 = splittable ? Math.floor(count / 2) : count;
    const count2 = count % 2;
    return (
        <div className={styles.item}>
            {splittable
                ? 'Добавляйте половинку или собирайте целые куски'
                : 'Добавляйте по целым кускам'}
            <div className={styles.pressCards}>
                <div className={combineStyles(styles.card, styles.inShadow)}>
                    <span>{'Целый'}</span>
                    <div className={combineStyles(styles.full, styles.img)} />
                    <span>{`${product.pressAmount} грамм`}</span>
                    <div
                        className={
                            count1 > 0 ? styles.fullText : styles.cardHover
                        }
                    >
                        {count1 > 0 ? `x${count1}` : ''}
                    </div>
                </div>
                {splittable && (
                    <div
                        className={combineStyles(styles.card, styles.inShadow)}
                    >
                        <span>{'Половинка'}</span>
                        <div
                            className={combineStyles(styles.half, styles.img)}
                        />
                        <span>{`${~~(product.pressAmount / 2)} грамм`}</span>
                        <div
                            className={
                                count2 > 0 ? styles.halfText : styles.cardHover
                            }
                        >
                            {count2 > 0 ? `x${count2}` : ''}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
