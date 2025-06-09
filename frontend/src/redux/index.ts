import { configureStore } from '@reduxjs/toolkit';
import basketReducer from './basket';
import { useDispatch, useSelector } from 'react-redux';
import orderSelectReducer from './orders';

export const store = configureStore({
    reducer: { basket: basketReducer, orderSelect: orderSelectReducer },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppStore = typeof store;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
