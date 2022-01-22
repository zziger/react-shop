import { model, Model, models, Schema } from "mongoose";

export interface ShopProduct {
    _id: string;
    name: string;
    price: number;
    image: string;
    favorite?: boolean;
    rating?: number;
    ratingCount?: number;
    ownRating?: number;
}

const schema = new Schema<ShopProduct>({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: false }
});
export const ShopProductModel = models.ShopProduct || model('ShopProduct', schema, 'products');