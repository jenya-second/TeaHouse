import { ScrollWrapper } from '#components/Basket/ScrollWrapper/ScrollWrapper.js';
import { PageName } from '#components/Common/PageName/PageName.js';
import { CostBar } from '#components/Processing/CostBar/CostBar.js';
import { ConfirmButtonPayment } from '#components/User/ConfirmButton2/ConfirmButtonPayment.js';
import { DeleteButton } from '#components/User/DeleteButton/DeleteButton.js';
import { OrderInfo } from '#components/User/OrderInfo/OrderInfo.js';
import {
    ProductChangedItem,
    ProductItem,
} from '#components/User/ProductItem/ProductItem.js';
import {
    GetCompleteOrderByKey,
    getOrderInProgressByKey,
} from '#utils/requests.js';
import { CircularProgress } from '@mui/material';
import {
    OrderEntity,
    OrderInProgressEntity,
    SaleNomenclatureEntity,
} from '@tea-house/types';
import { initData, useSignal } from '@telegram-apps/sdk-react';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';

export function FullOrder() {
    const { orderType, orderKey } = useParams();
    const [order, setOrder] = useState<OrderEntity[] | OrderInProgressEntity[]>(
        [],
    );
    const init = useSignal(initData.raw);
    let date: string[] = [];
    let viewType: 1 | 2 | 3 = 1;
    let items: SaleNomenclatureEntity[] = [];
    let deliveryCost: number | undefined = 0;
    if (order && order.length != 0) {
        if ((order[0] as OrderInProgressEntity).datetime) {
            if (order.length == 1) {
                viewType = 1;
            } else if ((order[0] as OrderInProgressEntity).payState) {
                viewType = 3;
            } else {
                viewType = 2;
            }
        } else {
            viewType = 3;
        }
        date = (
            (order[0] as OrderEntity).dateWTZ ||
            (order[0] as OrderInProgressEntity).datetime
        )
            .split(' ')[0]
            .split('-');
        if ((order[0] as OrderInProgressEntity).datetime)
            date[0] = `${+date[0] - 1}`;
        items =
            (order[0] as OrderEntity).saleNomenclatures ||
            (order[0] as OrderInProgressEntity).nomenclatures;
        if (viewType != 3 && !(order[0] as OrderInProgressEntity).isPickup) {
            const deliveryItem = items.find(
                (val) => val.product.name == 'Доставка',
            );
            deliveryCost = deliveryItem?.totalPrice;
        }
    }

    useEffect(() => {
        if (!orderKey || !init) return;
        if (orderType == 'p') {
            getOrderInProgressByKey(orderKey).then(setOrder);
        }
        if (orderType == 'c') {
            GetCompleteOrderByKey(orderKey).then((res) => setOrder([res]));
        }
    }, [init]);

    const jsxItems = useMemo(() => {
        if (order.length == 0) return <></>;
        const ord = order as OrderInProgressEntity[];
        if (ord[0].nomenclatures) {
            ord.sort((a, b) => b.state - a.state);
        }
        const myItems =
            (order[0] as OrderEntity).saleNomenclatures || ord[0].nomenclatures;
        if (viewType != 2) {
            return (
                <>
                    {myItems.map((val, i) => (
                        <ProductItem nom={val} key={i} />
                    ))}
                </>
            );
        }
        const d = ord[0].nomenclatures.find(
            (val) => val.product.name == 'Доставка',
        );
        const prev = ord[ord.length - 1].nomenclatures.filter(
            (val) =>
                val.product.name != 'Доставка' || 'Услуга доставки товаров',
        );
        const cur = ord[0].nomenclatures.filter(
            (val) =>
                val.product.name != 'Доставка' || 'Услуга доставки товаров',
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
        return (
            <>
                {ans}
                {d && <ProductItem key={0} nom={d} delivery={true} />}
            </>
        );
    }, [order]);

    return (
        <>
            {order.length == 0 ? (
                <CircularProgress />
            ) : (
                <>
                    <PageName
                        name={`Заказ от ${date[2]}.${date[1]}.${+date[0]}`}
                    />
                    {viewType != 3 && (
                        <DeleteButton
                            id={(order[0] as OrderInProgressEntity).id}
                        />
                    )}
                    <ScrollWrapper aaah={true}>
                        {jsxItems}
                        {viewType != 3 && (
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
