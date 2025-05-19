import { Route, Routes } from 'react-router';
import { WelcomePage } from './pages/WelcomePage';
import { Navigation } from './components/Common/Navigation/Navigation';
import { CatalogPage } from './pages/CatalogPage';
import { store } from './redux/index';
import { Provider } from 'react-redux';
import { BasketPage } from './pages/BasketPage';

function App() {
    return (
        <Provider store={store}>
            <Routes>
                <Route index element={<WelcomePage />} />
                <Route path="main" element={<Navigation />}>
                    <Route
                        path=":order/:categoryId/:productId?"
                        element={<CatalogPage />}
                    />
                    <Route path="basket" element={<BasketPage />} />
                </Route>
            </Routes>
        </Provider>
    );
}

export default App;
