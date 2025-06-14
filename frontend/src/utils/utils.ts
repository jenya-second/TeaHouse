import { ProductEntity } from '@tea-house/types';

export function ProductCost({
    product,
    count,
}: {
    product: ProductEntity;
    count: number;
}) {
    return product.press
        ? (count * product.cost * product.pressAmount) /
              (product.pressAmount >= 200 ? 2 : 1)
        : count * product.cost * 25;
}

export function GrammCount({
    product,
    count,
}: {
    product: ProductEntity;
    count: number;
}) {
    return product.press
        ? (count * product.pressAmount) / (product.pressAmount >= 200 ? 2 : 1)
        : count * 25;
}

export interface UserInfo {
    id: number;
    firstname: string;
    lastname: string;
    phone: string;
    tgId: number;
    username: string;
}

export interface OrderInfo {
    firstname: string;
    lastname: string;
    patronymic: string;
    phone: string;
    address: string;
    comment: string;
}
