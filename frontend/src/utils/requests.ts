import { CategoryEntity, ProductEntity } from '@tea-house/types';
import {
    IMAGE_URL,
    PRODUCT_ONE_URL,
    PRODUCTS_URL,
    SERVER_URL,
} from './constants';

function CreateApiLink(path: string = '') {
    return SERVER_URL + path;
}

export async function GetProductsRequest(): Promise<CategoryEntity[]> {
    return fetch(CreateApiLink(PRODUCTS_URL)).then((res) => res.json());
}

export async function GetProductByIdRequest(
    id: number,
): Promise<ProductEntity> {
    return fetch(CreateApiLink(PRODUCT_ONE_URL + id)).then((res) => res.json());
}

export function GetImagePath(imageId: number): string {
    return imageId ? CreateApiLink(IMAGE_URL + imageId) : '';
}
