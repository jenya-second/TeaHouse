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
            const countInGr = press ? 100 : 25;
            const max = action.payload.balance / countInGr;
            const currentCount = ind == -1 ? 0 : state.value[ind].count;
            // if (currentCount >= max) return;
            if (ind == -1) {
                state.value.push({ product: action.payload, count: 1 });
            } else {
                state.value[ind].count += 1;
            }
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
        },
    },
});

export const { addProduct, deleteProduct } = basketClice.actions;

export default basketClice.reducer;
