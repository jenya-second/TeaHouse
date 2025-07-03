import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CategoryEntity, ProductEntity } from '@tea-house/types';

export interface BasketState {
    value: { product: ProductEntity; count: number }[];
}

const init: BasketState = {
    value: [],
};

export const basketClice = createSlice({
    name: 'basket',
    initialState: init,
    reducers: {
        addProduct: (
            state: BasketState,
            action: PayloadAction<ProductEntity>,
        ) => {
            const ind = state.value.findIndex((val) => {
                return val.product.id == action.payload.id;
            });
            const press = action.payload.press;
            const countInGr = press
                ? action.payload.pressAmount /
                  (action.payload.pressAmount >= 200 ? 2 : 1)
                : 25;
            const max = Math.floor(action.payload.balance / countInGr);
            const currentCount = ind == -1 ? 0 : state.value[ind].count;
            if (currentCount >= max) return;
            if (ind == -1) {
                state.value.push({ product: action.payload, count: 1 });
            } else {
                state.value[ind].count += 1;
            }
            const s = state.value.map((val) => {
                return { index: val.product.nomNumber, count: val.count };
            });
            localStorage.setItem('basket', JSON.stringify(s));
        },
        deleteProduct: (
            state: BasketState,
            action: PayloadAction<ProductEntity>,
        ) => {
            const ind = state.value.findIndex((val) => {
                return val.product.id === action.payload.id;
            });
            if (ind == -1) return;
            if (state.value[ind].count == 1) {
                state.value.splice(ind, 1);
            } else {
                state.value[ind].count -= 1;
            }
            const s = state.value.map((val) => {
                return { index: val.product.nomNumber, count: val.count };
            });
            localStorage.setItem('basket', JSON.stringify(s));
        },
        deleteAll: () => {
            localStorage.setItem('basket', '[]');
            return { value: [] };
        },
        initBasket: (
            state: BasketState,
            action: PayloadAction<CategoryEntity[]>,
        ) => {
            const b = localStorage.getItem('basket');
            if (state.value.length != 0 || action.payload.length == 0)
                return state;
            if (!b) {
                localStorage.setItem('basket', '[]');
                return state;
            }
            const deliveryCategories = action.payload;
            const basketState: { product: ProductEntity; count: number }[] = [];
            const basket: { index: string; count: number }[] = JSON.parse(b);
            for (let i = 0; i < deliveryCategories.length; i++) {
                deliveryCategories[i].subcategories.forEach((cat) => {
                    basket.forEach((val) => {
                        const product = cat.products.find(
                            (z) => z.nomNumber == val.index,
                        );
                        if (!product) return;
                        const countInGr = product.press
                            ? product.pressAmount /
                              (product.pressAmount >= 200 ? 2 : 1)
                            : 25;
                        const max = Math.floor(product.balance / countInGr);
                        basketState.push({
                            count: Math.min(max, val.count),
                            product: product,
                        });
                    });
                });
            }
            const newState = { value: basketState };
            const s = newState.value.map((val) => {
                return { index: val.product.nomNumber, count: val.count };
            });
            localStorage.setItem('basket', JSON.stringify(s));
            return newState;
        },
    },
});

export const { addProduct, deleteProduct, deleteAll, initBasket } =
    basketClice.actions;

export default basketClice.reducer;
