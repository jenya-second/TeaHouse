import { CategoryEntity } from '@tea-house/types';
import { PRODUCTS_URL, SERVER_URL } from './constants';

function CreateApiLink(path: string = '') {
    console.log(import.meta.env.VITE_SERVER_IP);
    return SERVER_URL + path;
}

export function GetProductsRequest(): Promise<CategoryEntity[]> {
    return fetch(CreateApiLink(PRODUCTS_URL)).then((res) => res.json());
}
