import { useAppSelector } from '../redux';
import { BasketItem } from '../components/Basket/BasketItem';

export function BasketPage() {
    const products = useAppSelector((state) => state.basket.value);
    return (
        <>
            <h1>Корзина</h1>
            {products.map((product, i) => (
                <BasketItem
                    count={product.count}
                    product={product.product}
                    key={i}
                />
            ))}
        </>
    );
}
