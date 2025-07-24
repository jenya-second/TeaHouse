import { ScrollWrapper } from '#components/Basket/ScrollWrapper/ScrollWrapper.js';
import { PageName } from '#components/Common/PageName/PageName.js';
import { UserCategories } from '#components/User/UserCategories/UserCategories.js';

export function UserPage() {
    const categories = [
        { name: 'История заказов', route: '/user/history', image: '2' },
        { name: 'Чайный дневник', route: '/user/tea', image: '4' },
        { name: 'Адрес доставки', route: '/user/personal', image: '5' },
        { name: 'Чеки', route: '/user/check', image: '7' },
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
