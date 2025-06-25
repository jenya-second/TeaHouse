import { ScrollWrapper } from '#components/Basket/ScrollWrapper/ScrollWrapper.js';
import { PageName } from '#components/Common/PageName/PageName.js';
import { CheckItem } from '#components/User/CheckItem/CheckItem.js';
import { InfoButton } from '#components/User/InfoButton/InfoButton.js';
import { fetchChecks } from '#redux/checks.js';
import { useAppDispatch, useAppSelector } from '#redux/index.js';
import { initData, useSignal } from '@telegram-apps/sdk-react';
import { useEffect } from 'react';

export function CheckPage() {
    const checks = useAppSelector((state) => state.checks.value);
    const dispatch = useAppDispatch();
    const init = useSignal(initData.raw);

    useEffect(() => {
        if (!init) return;
        dispatch(fetchChecks());
    }, [init]);

    const m1 = 'Срок хранения чеков';
    const m2 =
        'Каждый чек заказа хранится ровно 2 год с даты появления. По истечении срока хранения чек удаляется из базы, однако информация о заказе всё ещё остаётся доступной. В истории выполненных заказов.';

    return (
        <>
            <PageName name={'Чеки'} />
            <InfoButton m1={m1} m2={m2} />
            <ScrollWrapper aaah={true}>
                {checks.map((val, i) => {
                    if (!val.closedWTZ) return;
                    const d = val.closedWTZ.split(' ')[0].split('-');
                    const date = d[2] + d[1] + d[0].slice(2);
                    return (
                        <CheckItem
                            cost={val.totalPrice}
                            date={`${d[2]}.${d[1]}.${d[0]}`}
                            link={`https://ofd.sbis.ru/rec/${val.KKTNumber}/${date}/${val.fiscalSign}`}
                            key={i}
                        />
                    );
                })}
            </ScrollWrapper>
        </>
    );
}
