import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    cacheDir: '../node_modules/.vite',
    server: {
        port: 1235,
    },
    preview: {
        port: 443,
        https: {
            cert: '/letsencrypt/live/oichai.maslo-spb.ru/fullchain.pem',
            key: '/letsencrypt/live/oichai.maslo-spb.ru/privkey.pem',
        },
    },
    plugins: [react()],
});
