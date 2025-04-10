export const SERVER_URL =
    'http://' +
    (import.meta.env.VITE_SERVER_IP ?? 'localhost') +
    ':' +
    (import.meta.env.VITE_SERVER_PORT ?? '1234');
export const PRODUCTS_URL = '/product/all';
