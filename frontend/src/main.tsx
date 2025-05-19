import { BrowserRouter } from 'react-router';
import { createRoot } from 'react-dom/client';
import App from './App';
import { init, viewport, retrieveLaunchParams } from '@telegram-apps/sdk-react';

try {
    init();

    if (viewport.mount.isAvailable()) {
        try {
            await viewport.mount();
        } catch (err) {
            console.log(viewport.mountError());
        }
    }
    const params = retrieveLaunchParams();

    if (viewport.expand.isAvailable()) {
        viewport.expand();
    }

    if (
        viewport.requestFullscreen.isAvailable() &&
        params.tgWebAppPlatform != 'macos' &&
        params.tgWebAppPlatform != 'tdesktop'
    ) {
        await viewport.requestFullscreen();
    }
} catch (e) {
    console.log(e);
}

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
);
