import { ProductEntity } from '@tea-house/types';
import { useContext, useState } from 'react';
import { CatalogTypeContext } from '../../utils/contexts';

export function CatalogItemSmall(props: { product: ProductEntity }) {
    const [count, setCount] = useState<number>(0);
    const catalogType = useContext(CatalogTypeContext);
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
                    {catalogType == 'В чайной' && (
                        <>
                            Count: {count}{' '}
                            <span
                                id="click"
                                onClick={() => setCount(count + 1)}
                            >
                                +
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
