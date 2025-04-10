import { ProductEntity } from '@tea-house/types';
import { useAppDispatch } from '../../redux';
import { addProduct, deleteProduct } from '../../redux/basket';

export function BasketItem(props: { product: ProductEntity; count: number }) {
    const dispatch = useAppDispatch();
    return (
        <>
            <div
                style={{
                    margin: '10px',
                    padding: '5px',
                    border: 'solid',
                }}
            >
                <div>Name: {props.product.name}</div>
                <div>
                    Cost: {props.product.cost} / {props.product.unit}
                    <br />
                    Count: {props.count}{' '}
                    <span
                        id="click"
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
