import {
    CategoryEntity,
    Delivery,
    OrderEntity,
    OrderInProgressEntity,
    ProductEntity,
    SABYOrderState,
    TeaDiaryEntity,
    TeaDiaryRequest,
    TelegramUserEntity,
} from '@tea-house/types';
import {
    COMPLETED_ORDERS,
    DELETE_ORDER,
    IMAGE_URL,
    ORDER_STATE,
    ORDERS_IN_PROGRESS,
    PAYMENT_LINK,
    POST_NEW_ORDER,
    PRODUCT_ONE_URL,
    PRODUCTS_URL,
    SERVER_URL,
    TEA_DIARY,
    USER,
} from './constants';
import { initData } from '@telegram-apps/sdk-react';

function CreateApiLink(path: string = '') {
    return SERVER_URL + path;
}

async function authFetch(url: string, request?: RequestInit) {
    const i = initData.raw();
    if (!i) return false;
    const req: RequestInit = {
        body: request?.body,
        method: request?.method,
        headers: [
            ['Content-Type', 'application/json'],
            ['authorization', i],
        ],
    };
    return fetch(url, req)
        .then((res) => res)
        .catch((_): false => false);
}

async function extractAuthFetch(url: string, request?: RequestInit) {
    const response = await authFetch(url, request);
    if (response == false) return false;
    if (!response.ok) return false;
    return response.json();
}

export async function GetProducts(): Promise<CategoryEntity[]> {
    return fetch(CreateApiLink(PRODUCTS_URL)).then((res) => res.json());
}

export async function GetProductById(id: number): Promise<ProductEntity> {
    return fetch(CreateApiLink(PRODUCT_ONE_URL + id)).then((res) => res.json());
}

export function GetImagePath(imageId: number): string {
    return imageId ? CreateApiLink(IMAGE_URL + imageId) : '';
}

export async function PostNewOrder(delivery: Delivery) {
    const content = {
        deliveryData: delivery,
    };
    const request: RequestInit = {
        method: 'POST',
        body: JSON.stringify(content),
    };
    return authFetch(CreateApiLink(POST_NEW_ORDER), request);
}

export async function GetCompletedOrders(): Promise<OrderEntity[]> {
    return extractAuthFetch(CreateApiLink(COMPLETED_ORDERS));
}

export async function GetCompleteOrderByKey(key: string): Promise<OrderEntity> {
    return extractAuthFetch(CreateApiLink(`${COMPLETED_ORDERS}/${key}`));
}

export async function GetOrdersInProgress(): Promise<OrderInProgressEntity[]> {
    return extractAuthFetch(CreateApiLink(ORDERS_IN_PROGRESS));
}

export async function GetOrderInProgressByKey(
    key: string,
): Promise<OrderInProgressEntity[]> {
    return extractAuthFetch(CreateApiLink(`${ORDERS_IN_PROGRESS}/${key}`));
}

export async function GetOrderStateByKey(
    key: string,
): Promise<SABYOrderState | false> {
    return extractAuthFetch(CreateApiLink(ORDER_STATE + key));
}

export async function GetPaymentLink(key: string): Promise<string> {
    const z = await authFetch(CreateApiLink(PAYMENT_LINK + key));
    if (!z) return '';
    return z.text();
}

export async function DeleteOrder(orderId: number): Promise<boolean> {
    const request: RequestInit = {
        method: 'DELETE',
    };
    return extractAuthFetch(CreateApiLink(DELETE_ORDER + orderId), request);
}

export async function GetUser(): Promise<TelegramUserEntity> {
    return extractAuthFetch(CreateApiLink(USER));
}

export async function GetAllTeaDiary(): Promise<TeaDiaryEntity[]> {
    return extractAuthFetch(CreateApiLink(TEA_DIARY));
}

export async function GetOneTeaDiary(
    productId: number,
): Promise<TeaDiaryEntity> {
    return extractAuthFetch(CreateApiLink(`${TEA_DIARY}/${productId}`));
}

export async function PostTeaDiary(teaDiary: TeaDiaryRequest) {
    const content = {
        teaDiary: teaDiary,
    };
    const request: RequestInit = {
        method: 'POST',
        body: JSON.stringify(content),
    };
    return authFetch(CreateApiLink(TEA_DIARY), request);
}
