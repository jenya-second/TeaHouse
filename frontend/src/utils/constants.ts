export const SERVER_URL =
    'https://' +
    (import.meta.env.VITE_SERVER_IP ?? 'localhost') +
    ':' +
    (import.meta.env.VITE_SERVER_PORT ?? '1234');
export const PRODUCTS_URL = '/product';
export const IMAGE_URL = '/image/';
export const PRODUCT_ONE_URL = '/product/';
export const POST_NEW_ORDER = '/auth/newOrder';
export const COMPLETED_ORDERS = '/auth/completedOrders';
export const ORDERS_IN_PROGRESS = '/auth/ordersInProgress';
export const PAYMENT_LINK = '/auth/payment/';
export const DELETE_ORDER = '/auth/';
export const BASKET_PATH = '/basket';
export const ORDER_STATE = '/auth/orderState/';
