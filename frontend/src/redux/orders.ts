import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface OrderSelectState {
    value: 1 | 2 | 3;
}

const init: OrderSelectState = {
    value: 1,
};

export const orderSelectSlice = createSlice({
    name: 'basket',
    initialState: init,
    reducers: {
        setOrderSelectState: (
            _: OrderSelectState,
            action: PayloadAction<1 | 2 | 3>,
        ) => {
            return { value: action.payload };
        },
    },
});

export const { setOrderSelectState } = orderSelectSlice.actions;

export default orderSelectSlice.reducer;
