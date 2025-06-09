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
