import { ScrollWrapper } from '#components/Basket/ScrollWrapper/ScrollWrapper.js';
import { PageName } from '#components/Common/PageName/PageName.js';
import { UserCategories } from '#components/User/UserCategories/UserCategories.js';

export function UserPage() {
    const categories = [
        { name: 'История заказов', route: '/user/history' },
        { name: 'Чайный дневник', route: '/user/tea' },
        { name: 'Адрес доставки', route: '/user/personal' },
        { name: 'Чеки', route: '/user/check' },
    ];

    return (
        <>
            <PageName name={'Профиль'} />
            <ScrollWrapper>
                <UserCategories categories={categories} />
            </ScrollWrapper>
        </>
    );
}
