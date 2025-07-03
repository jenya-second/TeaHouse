import { configureStore } from '@reduxjs/toolkit';
import basketReducer from './basket';
import { useDispatch, useSelector } from 'react-redux';
import orderSelectReducer from './orders';
import checksReducer from './checks';
import teaDiaryReducer from './tea';
import catalogsReducer from './catalog';

export const store = configureStore({
    reducer: {
        basket: basketReducer,
        orderSelect: orderSelectReducer,
        checks: checksReducer,
        tea: teaDiaryReducer,
        catalog: catalogsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppStore = typeof store;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
