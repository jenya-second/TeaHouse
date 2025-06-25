import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductEntity } from '@tea-house/types';

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
        initBasket: (_: BasketState, action: PayloadAction<BasketState>) => {
            const s = action.payload.value.map((val) => {
                return { index: val.product.nomNumber, count: val.count };
            });
            localStorage.setItem('basket', JSON.stringify(s));
            return action.payload;
        },
    },
});

export const { addProduct, deleteProduct, deleteAll, initBasket } =
    basketClice.actions;

export default basketClice.reducer;
