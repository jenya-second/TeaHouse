import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    cacheDir: '../node_modules/.vite',
    server: {
        port: 1235,
        host: '192.168.0.104',
    },
    preview: {
        port: 1235,
        host: '192.168.0.104',
    },
    plugins: [react()],
});
