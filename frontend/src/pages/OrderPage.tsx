import { ScrollWrapper } from '#components/Basket/ScrollWrapper/ScrollWrapper.js';
import { PageName } from '#components/Common/PageName/PageName.js';
import {
    EmptyListCompletedOrders,
    EmptyListNewOrders,
    EmptyListOrdersInProgress,
} from '#components/User/EmptyList/EmptyList.js';
import { OrderItem } from '#components/User/OrderItem/OrderItem.js';
import { OrderToggle } from '#components/User/OrdersToggle/OrderToggle.js';
import { useAppDispatch, useAppSelector } from '#redux/index.js';
import { setOrderSelectState } from '#redux/orders.js';
import { GetCompletedOrders, getOrdersInProgress } from '#utils/requests.js';
import { OrderEntity, OrderInProgressEntity } from '@tea-house/types';
import { initData, useSignal } from '@telegram-apps/sdk-react';
import { JSX, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

export function OrderPage() {
    const toggleState = useAppSelector((state) => state.orderSelect.value);
    const [inProgress, setInProgress] = useState<OrderInProgressEntity[]>();
    const [complete, setComplete] = useState<OrderEntity[]>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const init = useSignal(initData.raw);

    const [newOrders, ordersInProgress, completeOrders] = useMemo((): [
        OrderInProgressEntity[],
        { order: OrderInProgressEntity; correct: boolean }[],
        (OrderInProgressEntity | OrderEntity)[],
    ] => {
        if (!inProgress) return [[], [], []];
        const newOrders: OrderInProgressEntity[] = [];
        const ordersInProgress: {
            order: OrderInProgressEntity;
            correct: boolean;
        }[] = [];
        const completeOrders: (OrderInProgressEntity | OrderEntity)[] =
            complete ?? [];
        for (let i = 0; i < inProgress.length; i++) {
            const z = inProgress
                .filter((val) => val.key == inProgress[i].key)
                .sort((a, b) => b.state - a.state);
            const x = ordersInProgress.find(
                (val) => val.order.key == inProgress[i].key,
            );
            const c = completeOrders.find(
                (val) => val.key == inProgress[i].key,
            );
            if (x || c) continue;
            if (z.length == 1) {
                newOrders.push(inProgress[i]);
                continue;
            }
            if (z[0].payState) {
                completeOrders.push(z[0]);
                continue;
            }
            const prev = z[z.length - 1].nomenclatures.filter(
                (val) =>
                    val.product.name != 'Доставка' || 'Услуга доставки товаров',
            );
            const cur = z[0].nomenclatures.filter(
                (val) =>
                    val.product.name != 'Доставка' || 'Услуга доставки товаров',
            );
            if (prev.length != cur.length) {
                ordersInProgress.push({ order: z[0], correct: true });
                continue;
            }
            let bebe = false;
            for (let i = 0; i < cur.length; i++) {
                if (
                    cur[i].quantity != prev[i].quantity ||
                    cur[i].product.indexNumber != prev[i].product.indexNumber
                ) {
                    ordersInProgress.push({ order: z[0], correct: true });
                    bebe = true;
                    break;
                }
            }
            if (!bebe) ordersInProgress.push({ order: z[0], correct: false });
        }
        newOrders.sort((a, b) =>
            a.datetime.split(' ')[0] > b.datetime.split(' ')[0] ? -1 : 1,
        );
        ordersInProgress.sort((a, b) =>
            a.order.datetime.split(' ')[0] > b.order.datetime.split(' ')[0]
                ? -1
                : 1,
        );
        completeOrders.sort((a, b) => {
            const datea = (
                (a as OrderEntity).dateWTZ ||
                (a as OrderInProgressEntity).datetime
            ).split(' ')[0];
            const dateb = (
                (b as OrderEntity).dateWTZ ||
                (b as OrderInProgressEntity).datetime
            ).split(' ')[0];
            return datea > dateb ? -1 : 1;
        });
        return [newOrders, ordersInProgress, completeOrders];
    }, [inProgress, complete]);

    useEffect(() => {
        if (!init) return;
        getOrdersInProgress().then(setInProgress);
        GetCompletedOrders().then(setComplete);
    }, [init]);

    let list: JSX.Element;

    switch (toggleState) {
        case 1:
            list =
                newOrders.length == 0 ? (
                    <EmptyListNewOrders />
                ) : (
                    <>
                        {newOrders.map((val, i) => (
                            <div
                                key={i}
                                onClick={() =>
                                    navigate(`/user/history/p/${val.key}`)
                                }
                            >
                                <OrderItem type={1} order={val} />
                            </div>
                        ))}
                    </>
                );
            break;
        case 2:
            list =
                ordersInProgress.length == 0 ? (
                    <EmptyListOrdersInProgress count={newOrders.length} />
                ) : (
                    <>
                        {ordersInProgress.map((val, i) => {
                            return (
                                <div
                                    key={i}
                                    onClick={() =>
                                        navigate(
                                            `/user/history/p/${val.order.key}`,
                                        )
                                    }
                                >
                                    <OrderItem
                                        type={2}
                                        order={val.order}
                                        cor={val.correct}
                                    />
                                </div>
                            );
                        })}
                    </>
                );
            break;
        case 3:
            list =
                completeOrders.length == 0 ? (
                    <EmptyListCompletedOrders />
                ) : (
                    <>
                        {completeOrders.map((val, i) => {
                            const orderType = (val as OrderInProgressEntity)
                                .datetime
                                ? 'p'
                                : 'c';
                            return (
                                <div
                                    key={i}
                                    onClick={() =>
                                        navigate(
                                            `/user/history/${orderType}/${val.key}`,
                                        )
                                    }
                                >
                                    <OrderItem type={3} order={val} />
                                </div>
                            );
                        })}
                    </>
                );
            break;
        default:
            list = <div />;
    }

    return (
        <>
            <PageName name="История заказов" />
            <OrderToggle
                state={toggleState}
                setState={(newState) => dispatch(setOrderSelectState(newState))}
            />
            <ScrollWrapper topHeight={26} aaah={true}>
                {inProgress && complete && list}
            </ScrollWrapper>
        </>
    );
}
