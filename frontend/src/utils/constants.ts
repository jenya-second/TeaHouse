export const SERVER_URL =
    'http://' +
    (import.meta.env.VITE_SERVER_IP ?? 'localhost') +
    ':' +
    (import.meta.env.VITE_SERVER_PORT ?? '1234');
export const PRODUCTS_URL = '/product';
export const IMAGE_URL = '/image/';
export const PRODUCT_ONE_URL = '/product/';
export const BASKET_PATH = '/main/basket';
