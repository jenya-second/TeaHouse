import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    cacheDir: '../node_modules/.vite',
    server: {
        port: 443,
        allowedHosts: ['oichai.maslo-spb.ru'],
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
