import { ProductEntity } from '@tea-house/types';
import { useContext } from 'react';
import { CatalogTypeContext } from '../../../utils/contexts';
import { addProduct, deleteProduct } from '../../../redux/basket';
import { useAppDispatch, useAppSelector } from '../../../redux';
import styles from './CatalogItemSmall.module.scss';
import { combineStyles } from '#utils/styles.js';

export function CatalogItemSmall(props: { product: ProductEntity }) {
    const catalogType = useContext(CatalogTypeContext);
    const dispatch = useAppDispatch();
    const countRedux = useAppSelector((state) => {
        const ind = state.basket.value.findIndex((val) => {
            return val.product.id == props.product.id;
        });
        return ind == -1 ? 0 : state.basket.value[ind].count;
    });
    return (
        <>
            <div className={combineStyles(styles.item, styles.outShadow)}>
                <div>Name: {props.product.name}</div>
                <div>
                    Cost: {props.product.cost} / {props.product.unit}
                    <br />
                    {catalogType == 'В чайной' && (
                        <>
                            Count: {countRedux}{' '}
                            <span
                                id="click_minus"
                                onClick={() => {
                                    dispatch(addProduct(props.product));
                                }}
                            >
                                +
                            </span>
                            {'  '}
                            <span
                                id="click_plus"
                                onClick={() => {
                                    dispatch(deleteProduct(props.product));
                                }}
                            >
                                -
                            </span>
                        </>
                    )}
                </div>
                {props.product.images &&
                    props.product.images.map((img) => (
                        <img
                            key={img.id}
                            style={{
                                margin: '10px',
                                width: '90%',
                            }}
                            src={'http://localhost:1234/image/' + img?.id}
                        />
                    ))}
            </div>
        </>
    );
}
