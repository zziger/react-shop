import { configureStore } from '@reduxjs/toolkit';
import { getState, saveState } from '../src/utils';
import cartReducer, { CartStore } from './cartSlice';

export const store = configureStore({
    reducer: {
        cart: cartReducer
    },
    devTools: true,
    preloadedState: getState()
});

store.subscribe(() => {
    saveState(store.getState());
});

export type RootStore = {
    cart: CartStore,
};