import { Route, Routes } from 'react-router';
import { WelcomePage } from './pages/WelcomePage';
import { Navigation } from './components/Common/Navigation/Navigation';
import { CatalogPage } from './pages/CatalogPage';
import { store } from './redux/index';
import { Provider } from 'react-redux';
import { BasketPage } from './pages/BasketPage';
import { useEffect } from 'react';
import {
    backButton,
    closeMiniApp,
    init,
    initData,
    retrieveLaunchParams,
    viewport,
} from '@telegram-apps/sdk-react';
import { ProcessingPage } from '#pages/ProcessingPage.js';
import { UserPage } from '#pages/UserPage.js';
import { OrderPage } from '#pages/OrderPage.js';
import { FullOrder } from '#pages/FullOrder.js';
import { OrderInfo, UserInfo } from '#utils/utils.js';

function App() {
    useEffect(() => {
        const z = localStorage.getItem('user');
        const x = localStorage.getItem('orderInfoGlobal');
        const c = localStorage.getItem('orderInfo');
        const v = localStorage.getItem('basket');
        if (!z) {
            const user: UserInfo = {
                firstname: '',
                lastname: '',
                id: -1,
                phone: '',
                tgId: -1,
                username: '',
            };
            localStorage.setItem('user', JSON.stringify(user));
        }
        if (!x) {
            const orderInfo: OrderInfo = {
                address: '',
                comment: '',
                firstname: '',
                lastname: '',
                patronymic: '',
                phone: '',
            };
            localStorage.setItem('orderInfoGlobal', JSON.stringify(orderInfo));
            localStorage.setItem('orderInfo', JSON.stringify(orderInfo));
        }
        if (!c) {
            localStorage.setItem(
                'orderInfo',
                localStorage.getItem('orderInfoGlobal') ?? '?',
            );
        }
        if (!v) {
            localStorage.setItem('orderInfo', '[]');
        }
        try {
            init();
            const params = retrieveLaunchParams();
            initData.restore();
            if (!viewport.mount.isAvailable()) return;
            viewport.mount().then(() => {
                if (viewport.expand.isAvailable()) {
                    viewport.expand();
                }
                if (
                    viewport.requestFullscreen.isAvailable() &&
                    params.tgWebAppPlatform != 'macos' &&
                    params.tgWebAppPlatform != 'tdesktop'
                ) {
                    viewport.requestFullscreen();
                }
                if (backButton.mount.isAvailable()) {
                    backButton.mount();
                    backButton.show();
                    backButton.onClick(closeMiniApp);
                }
            });
        } catch (e) {
            console.log(e);
        }
    }, []);

    return (
        <Provider store={store}>
            <Routes>
                <Route index element={<WelcomePage />} />
                <Route element={<Navigation />}>
                    <Route
                        path=":order/:categoryId/:productId?"
                        element={<CatalogPage />}
                    />
                    <Route path="basket/:productId?" element={<BasketPage />} />
                    <Route path="processing" element={<ProcessingPage />} />
                    <Route path={'user'}>
                        <Route index element={<UserPage />} />
                        <Route path="history">
                            <Route index element={<OrderPage />} />
                            <Route
                                path=":orderType/:orderKey"
                                element={<FullOrder />}
                            />
                        </Route>
                        <Route path="tea" element={<UserPage />} />
                        <Route path="personal" element={<UserPage />} />
                        <Route path="check" element={<UserPage />} />
                    </Route>
                </Route>
            </Routes>
        </Provider>
    );
}

export default App;
