import { ScrollWrapper } from '#components/Basket/ScrollWrapper/ScrollWrapper.js';
import { PageName } from '#components/Common/PageName/PageName.js';
import { DeliveryForm } from '#components/Processing/DeliveryForm/DeliveryForm.js';
import { Radio } from '#components/Processing/Radio/Radio.js';
import { Shedule } from '#components/Processing/Shedule/Shedule.js';
import { createContext, useState } from 'react';

export const OrderContext = createContext(() => undefined);

export function ProcessingPage() {
    const [isPickup, setIsPickup] = useState(true);
    return (
        <>
            <PageName name={'Заказ'} />
            <ScrollWrapper>
                <div
                    style={{ display: 'flex', justifyContent: 'space-evenly' }}
                >
                    <Radio
                        labelText="Самовывоз"
                        onSet={() => setIsPickup(true)}
                        state={isPickup}
                    />
                    <Radio
                        labelText="Доставка"
                        onSet={() => setIsPickup(false)}
                        state={!isPickup}
                    />
                </div>
                {isPickup ? <Shedule /> : <DeliveryForm />}
            </ScrollWrapper>
        </>
    );
}
