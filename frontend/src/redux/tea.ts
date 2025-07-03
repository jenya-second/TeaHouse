import { GetAllTeaDiary } from '#utils/requests.js';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TeaDiaryRequest } from '@tea-house/types';

export interface TeaDiaryState {
    value: TeaDiaryRequest[];
}

const init: TeaDiaryState = {
    value: [],
};

export const fetchTeaDiary = createAsyncThunk('fetchTeaDiary', async () => {
    return await GetAllTeaDiary();
});

export const teaSlice = createSlice({
    name: 'tea',
    initialState: init,
    reducers: {
        setTeaDiary: (
            state: TeaDiaryState,
            newEntity: PayloadAction<TeaDiaryRequest>,
        ) => {
            if (!newEntity.payload) return state;
            const ind = state.value.findIndex(
                (val) => val.productId == newEntity.payload.productId,
            );
            if (ind == -1) {
                state.value.push(newEntity.payload);
            } else {
                state.value[ind] = newEntity.payload;
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTeaDiary.fulfilled, (state, action) => {
            if (!action.payload) return state;
            // if (state.value.length != action.payload.length)
            const ans: TeaDiaryRequest[] = action.payload.map((val) => {
                return {
                    impression: val.impression,
                    smell: val.smell,
                    afterstate: val.afterstate,
                    productId: val.product.id,
                    rank: val.rank,
                    taste: val.taste,
                };
            });
            return { value: ans };
            // state.value.sort((a, b) => a.id - b.id);
            // action.payload.sort((a, b) => a.id - b.id);
            // let same = true;
            // state.value.forEach((val, i) => {
            //     if (val.rank != action.payload[i].rank) {
            //         same = false;
            //     }
            // });
            // return same ? state : { value: action.payload };
        });
    },
});

export const { setTeaDiary } = teaSlice.actions;

export default teaSlice.reducer;
