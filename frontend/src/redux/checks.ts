import { GetCompletedOrders } from '#utils/requests.js';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { OrderEntity } from '@tea-house/types';

export interface ChecksState {
    value: OrderEntity[];
}

const init: ChecksState = {
    value: [],
};

export const fetchChecks = createAsyncThunk('fetchChecksStatus', async () => {
    return await GetCompletedOrders();
});

export const checksSlice = createSlice({
    name: 'checks',
    initialState: init,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchChecks.fulfilled, (state, action) => {
            if (!action.payload) return state;
            if (state.value.length == action.payload.length) return state;
            return { value: action.payload };
        });
    },
});

// export const {  } = checksSlice.actions;

export default checksSlice.reducer;
