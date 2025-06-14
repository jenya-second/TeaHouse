import { ScrollWrapper } from '#components/Basket/ScrollWrapper/ScrollWrapper.js';
import { PageName } from '#components/Common/PageName/PageName.js';
import { CostBar } from '#components/Processing/CostBar/CostBar.js';
import { ConfirmButtonPayment } from '#components/User/ConfirmButton2/ConfirmButtonPayment.js';
import { DeleteButton } from '#components/User/DeleteButton/DeleteButton.js';
import { OrderInfo } from '#components/User/OrderInfo/OrderInfo.js';
import { PaymentAwait } from '#components/User/OrderItem/OrderItem.js';
import {
    ProductChangedItem,
    ProductItem,
} from '#components/User/ProductItem/ProductItem.js';
import {
    GetCompleteOrderByKey,
    getOrderInProgressByKey,
    getOrderStateByKey,
} from '#utils/requests.js';
import { CircularProgress } from '@mui/material';
import { OrderEntity, OrderInProgressEntity } from '@tea-house/types';
import { initData, useSignal } from '@telegram-apps/sdk-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';

export function FullOrder() {
    const { orderType, orderKey } = useParams();
    const [order, setOrder] = useState<OrderEntity[] | OrderInProgressEntity[]>(
        [],
    );
    const [payState, setPayState] = useState<
        'not' | 'processing' | 'fulfilled'
    >();
    const timer = useRef<NodeJS.Timeout>(undefined);
    const init = useSignal(initData.raw);

    const notifyPayState = async () => {
        if (!orderKey) {
            timer.current = setTimeout(notifyPayState, 5000);
            return;
        }
        const state = await getOrderStateByKey(orderKey);
        let newT: 'not' | 'processing' | 'fulfilled';
        if (state.payments.length == undefined) {
            newT = 'not';
        } else {
            newT = state.payments[0].isClosed ? 'fulfilled' : 'processing';
        }
        setPayState((val) => {
            console.log(val, newT);
            if (!val || newT == 'not') {
                timer.current = setTimeout(notifyPayState, 5000);
            }
            return val == newT ? val : newT;
        });
    };

    useEffect(() => {
        if (!orderKey || !init) return;
        if (orderType == 'p') {
            getOrderInProgressByKey(orderKey).then(setOrder);
        }
        if (orderType == 'c') {
            GetCompleteOrderByKey(orderKey).then((res) => setOrder([res]));
        }
        notifyPayState();
        return () => clearTimeout(timer.current);
    }, [init]);

    const [jsxItems, viewType, date, deliveryCost] = useMemo(() => {
        if (order.length == 0 || !payState)
            return [<></>, 3, ['00', '00', '00'], 0];
        const ord = order as OrderInProgressEntity[];
        let viewType: 1 | 2 | 3 | 4 = 1;
        if (orderType == 'p') {
            if (order.length == 1) {
                viewType = 1;
            } else if (payState != 'not') {
                viewType = payState == 'fulfilled' ? 3 : 4;
            } else {
                viewType = 2;
            }
        } else {
            viewType = 3;
        }
        const date = ((order[0] as OrderEntity).dateWTZ || ord[0].datetime)
            .split(' ')[0]
            .split('-');
        if (orderType == 'p') date[0] = `${+date[0] - 1}`;
        if (orderType == 'p') {
            ord.sort((a, b) => b.state - a.state);
        }
        const items =
            (order[0] as OrderEntity).saleNomenclatures || ord[0].nomenclatures;
        if (viewType != 2) {
            const jsxItems = (
                <>
                    {items.map((val, i) => (
                        <ProductItem nom={val} key={i} />
                    ))}
                </>
            );
            return [jsxItems, viewType, date, ord[0]?.isPickup ? 0 : undefined];
        }
        const deliveryItem = items.find(
            (val) => val.product.name == 'Доставка',
        );
        const prev = ord[ord.length - 1].nomenclatures.filter(
            (val) =>
                val.product.name != 'Доставка' &&
                val.product.name != 'Услуга доставки товаров',
        );
        const cur = ord[0].nomenclatures.filter(
            (val) =>
                val.product.name != 'Доставка' &&
                val.product.name != 'Услуга доставки товаров',
        );
        const ans = prev.map((val, i) => {
            const a = cur.find(
                (curVal) =>
                    curVal.product.indexNumber == val.product.indexNumber,
            );
            const nulled = !a;
            if (a && a.quantity == val.quantity)
                return <ProductItem key={i} nom={a} />;
            return (
                <ProductChangedItem
                    key={i}
                    curNom={a ? a : val}
                    prevNom={val}
                    nulled={nulled}
                />
            );
        });
        const jsxItems = (
            <>
                {ans}
                {deliveryItem && (
                    <ProductItem key={0} nom={deliveryItem} delivery={true} />
                )}
            </>
        );
        return [jsxItems, viewType, date, deliveryItem?.totalPrice];
    }, [order, payState]);

    return (
        <>
            {order.length == 0 ? (
                <CircularProgress />
            ) : (
                <>
                    <PageName
                        name={`Заказ от ${date[2]}.${date[1]}.${+date[0]}`}
                    />
                    {(viewType == 1 || viewType == 2) && (
                        <DeleteButton
                            id={(order[0] as OrderInProgressEntity).id}
                        />
                    )}
                    <ScrollWrapper aaah={true}>
                        {viewType == 4 && <PaymentAwait />}
                        {jsxItems}
                        {(viewType == 1 || viewType == 2) && (
                            <>
                                <OrderInfo
                                    order={order[0] as OrderInProgressEntity}
                                />
                                <CostBar
                                    cost={order[0].totalPrice}
                                    delivery={deliveryCost}
                                />
                            </>
                        )}
                        {viewType == 2 && (
                            <ConfirmButtonPayment orderKey={order[0].key} />
                        )}
                    </ScrollWrapper>
                </>
            )}
        </>
    );
}
