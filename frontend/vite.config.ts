import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    cacheDir: '../node_modules/.vite',
    server: {
        port: 1235,
    },
    preview: {
        port: 80,
    },
    plugins: [react()],
});
