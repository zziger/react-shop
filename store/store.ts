import { configureStore } from '@reduxjs/toolkit';
import cartReducer, { CartStore } from './cartSlice';

export const store = configureStore({
    reducer: {
        cart: cartReducer
    },
    devTools: true
});

export type RootStore = {
    cart: CartStore,
};