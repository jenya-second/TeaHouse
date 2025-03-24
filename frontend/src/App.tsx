import { Route, Routes } from 'react-router';
import { MainPage } from './pages/MainPage';
import { Navigation } from './components/Navigation';
import { CatalogPage } from './pages/CatalogPage';

function App() {
    return (
        <Routes>
            <Route index element={<MainPage />} />
            <Route path="main" element={<Navigation />}>
                <Route index element={<CatalogPage />} />
            </Route>
        </Routes>
    );
}

export default App;
