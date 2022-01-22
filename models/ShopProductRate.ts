import { model, Model, models, Schema, Types } from "mongoose";
import { User } from "./User";

export interface ShopProductRate {
    _id: string;
    user: Types.ObjectId;
    product: Types.ObjectId;
    rating: number;
    comment: string;
    userObject?: User;
}

const schema = new Schema<ShopProductRate>({
    user: { type: Types.ObjectId, required: true },
    product: { type: Types.ObjectId, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: false }
});
export const ShopProductRateModel = models.ShopProductRate || model('ShopProductRate', schema, 'productRates');