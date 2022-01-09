import { model, Model, models, Schema } from "mongoose";

export interface ShopProduct {
    _id: string;
    name: string;
    price: number;
    image: string;
    favorite?: boolean;
}

const schema = new Schema<ShopProduct>({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: false }
});
export const ShopProductModel = models.ShopProduct || model('ShopProduct', schema, 'products');