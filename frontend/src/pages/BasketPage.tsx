import { useAppSelector } from '../redux';
import { PageName } from '#components/Common/PageName/PageName.js';
import { ScrollWrapper } from '#components/Basket/ScrollWrapper/ScrollWrapper.js';
import { CatalogItemSmall } from '#components/Catalog/CatalogItemSmall/CatalogItemSmall.js';
import { useNavigate } from 'react-router';
import { EmptyBasket } from '#components/Basket/EmptyBasket/EmptyBasket.js';
import { BasketFooter } from '#components/Basket/BasketFooter/BasketFooter.js';

export function BasketPage() {
    const products = useAppSelector((state) => state.basket.value);
    let cost = 0;
    products.forEach((product) => {
        cost += product.product.press
            ? (product.count *
                  product.product.cost *
                  product.product.pressAmount) /
              (product.product.pressAmount >= 200 ? 2 : 1)
            : product.count * product.product.cost * 25;
    });
    const navigate = useNavigate();
    return (
        <>
            <PageName name={'Корзина'} />
            {products.length == 0 ? (
                <EmptyBasket />
            ) : (
                <ScrollWrapper>
                    <div>
                        {products.map((product, i) => (
                            <div
                                key={i}
                                onClick={() =>
                                    navigate(`/basket/${product.product.id}`)
                                }
                            >
                                <CatalogItemSmall
                                    showCounter={true}
                                    product={product.product}
                                />
                            </div>
                        ))}
                    </div>
                    <BasketFooter cost={cost} />
                </ScrollWrapper>
            )}
        </>
    );
}
