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
import {
    GetCompletedOrders,
    getOrdersInProgress,
    getOrderStateByKey,
} from '#utils/requests.js';
import { OrderEntity, OrderInProgressEntity } from '@tea-house/types';
import { initData, useSignal } from '@telegram-apps/sdk-react';
import { JSX, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

type OP = OrderInProgressEntity;
type O = OrderEntity;
type OWM<T> = {
    order: T;
    mod: undefined | 'cor' | 'tran';
};

export function OrderPage() {
    const toggleState = useAppSelector((state) => state.orderSelect.value);
    const [newOrders, setNewOrders] = useState<OP[]>([]);
    const [ordersInProgress, setOrdersInProgress] = useState<OWM<OP>[]>([]);
    const [completeOrders, setCompleteOrders] = useState<OWM<O | OP>[]>([]);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const init = useSignal(initData.raw);
    const timers = useRef<Map<string, NodeJS.Timeout>>(new Map());

    //never ask developer what's going on here
    //i know how to do it right, but for now, this is how it's gonna be
    const notifyOrderInProgress = async (order: OP) => {
        const state = await getOrderStateByKey(order.key);
        let newT: 1 | 2 | 3;
        if (state.payments.length == undefined) {
            newT = 1;
        } else {
            newT = state.payments[0].isClosed ? 3 : 2;
        }
        setOrdersInProgress((val) => {
            const OPIndex = val.find((val) => val.order.key == order.key);
            if (!OPIndex || newT == 1) return val;
            const nO = val.filter((val) => val.order.key != order.key);
            return nO;
        });
        setCompleteOrders((val) => {
            const CIndex = val.find((val) => val.order.key == order.key);
            let curT: 1 | 2 | 3 = 1;
            if (CIndex) curT = CIndex.mod == 'tran' ? 2 : 3;
            if (curT == newT) {
                timers.current.set(
                    order.key,
                    setTimeout(() => notifyOrderInProgress(order), 5000),
                );
                return val;
            }
            const nC = val.filter((val) => val.order.key != order.key);
            if (newT == 2) {
                nC.push({ mod: 'tran', order });
            } else if (newT == 3) {
                nC.push({ mod: undefined, order });
            }
            nC.sort((a, b) => {
                const datea =
                    (a.order as O).dateWTZ || (a.order as OP).datetime;
                const dateb =
                    (b.order as O).dateWTZ || (b.order as OP).datetime;
                return datea > dateb ? -1 : 1;
            });
            return nC;
        });
    };

    const resolveCompleted = (complete: O[]) => {
        const no = complete.map((val) => {
            return { order: val, mod: undefined };
        });
        setCompleteOrders((val) => {
            const bebe = [...no, ...val];
            return bebe.sort((a, b) => {
                const datea =
                    (a.order as O).dateWTZ || (a.order as OP).datetime;
                const dateb =
                    (b.order as O).dateWTZ || (b.order as OP).datetime;
                return datea > dateb ? -1 : 1;
            });
        });
    };

    const resolveInProgress = (inProgress: OrderInProgressEntity[]) => {
        const _newOrders: OP[] = [];
        const _ordersInProgress: OWM<OP>[] = [];
        const _completeOrders: OWM<O | OP>[] = [];
        for (let i = 0; i < inProgress.length; i++) {
            const z = inProgress
                .filter((val) => val.key == inProgress[i].key)
                .sort((a, b) => b.state - a.state);
            const x = _ordersInProgress.find(
                (val) => val.order.key == inProgress[i].key,
            );
            const c = _completeOrders.find(
                (val) => val.order.key == inProgress[i].key,
            );
            if (x || c) continue;
            if (z.length == 1) {
                _newOrders.push(inProgress[i]);
                continue;
            }
            if (z[0].payState != 'not') {
                _completeOrders.push({
                    order: z[0],
                    mod: z[0].payState == 'processing' ? 'tran' : undefined,
                });
                continue;
            }
            const prev = z[z.length - 1].nomenclatures.filter(
                (val) =>
                    val.product.name != 'Доставка' &&
                    val.product.name != 'Услуга доставки товаров',
            );
            const cur = z[0].nomenclatures.filter(
                (val) =>
                    val.product.name != 'Доставка' &&
                    val.product.name != 'Услуга доставки товаров',
            );
            if (prev.length != cur.length) {
                _ordersInProgress.push({ order: z[0], mod: 'cor' });
                continue;
            }
            let bebe = false;
            for (let i = 0; i < cur.length; i++) {
                if (
                    cur[i].quantity != prev[i].quantity ||
                    cur[i].product.indexNumber != prev[i].product.indexNumber
                ) {
                    _ordersInProgress.push({ order: z[0], mod: 'cor' });
                    bebe = true;
                    break;
                }
            }
            if (!bebe) _ordersInProgress.push({ order: z[0], mod: undefined });
        }
        _newOrders.sort((a, b) => (a.datetime > b.datetime ? -1 : 1));
        _ordersInProgress.sort((a, b) =>
            a.order.datetime > b.order.datetime ? -1 : 1,
        );
        _ordersInProgress.forEach((val) => notifyOrderInProgress(val.order));
        setNewOrders(_newOrders);
        setOrdersInProgress(_ordersInProgress);
        setCompleteOrders((val) => {
            const bebe = [..._completeOrders, ...val];
            return bebe.sort((a, b) => {
                const datea =
                    (a.order as O).dateWTZ || (a.order as OP).datetime;
                const dateb =
                    (b.order as O).dateWTZ || (b.order as OP).datetime;
                return datea > dateb ? -1 : 1;
            });
        });
    };

    useEffect(() => {
        if (!init) return;
        GetCompletedOrders().then(resolveCompleted);
        getOrdersInProgress().then(resolveInProgress);
    }, [init]);

    useEffect(() => {
        return () => {
            timers.current.forEach(clearTimeout);
        };
    }, []);

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
                                        cor={val.mod}
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
                            const orderType = (val.order as OP).datetime
                                ? 'p'
                                : 'c';
                            return (
                                <div
                                    key={i}
                                    onClick={() =>
                                        navigate(
                                            `/user/history/${orderType}/${val.order.key}`,
                                        )
                                    }
                                >
                                    <OrderItem
                                        type={3}
                                        order={val.order}
                                        cor={val.mod}
                                    />
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
                {newOrders && ordersInProgress && completeOrders && list}
            </ScrollWrapper>
        </>
    );
}
