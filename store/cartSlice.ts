import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ShopProduct } from "../models/ShopProduct";
import { RootStore } from "./store";

export interface CartElement {
    id: string;
    qty: number;
    product?: ShopProduct;
}

export interface CartStore {
    cart: CartElement[];
}

const initialState: CartStore = {
    cart: []
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem(store, action: PayloadAction<string>) {
            store.cart.push({ id: action.payload, qty: 1 });
        },
        removeItem(store, action: PayloadAction<string>) {
            store.cart = store.cart.filter(e => e.id != action.payload);
        },
        changeItemQty(store, action: PayloadAction<{ id: string, qty: number }>) {
            if (action.payload.qty <= 0) {
                store.cart = store.cart.filter(e => e.id != action.payload.id);
                return;
            }

            const item = store.cart.find(e => e.id == action.payload.id);
            if (item) item.qty = action.payload.qty;
        },
        clear(store) {
            store.cart = [];
        }
    }
});

export const cartActions = cartSlice.actions;
export const getCartItems = (store: RootStore) => store.cart.cart;
export const getItemQty = (id: string) => (store: RootStore) => store.cart.cart.find(e => e.id == id)?.qty ?? 0;

export default cartSlice.reducer;