import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    cacheDir: '../node_modules/.vite',
    server: {
        port: 1235,
        allowedHosts: ['.maslo-spb.ru'],
    },
    preview: {
        port: 1235,
        allowedHosts: ['.maslo-spb.ru'],
    },
    plugins: [react()],
});
