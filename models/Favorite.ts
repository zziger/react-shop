import { model, Model, models, Schema, Types } from "mongoose";

export interface Favorite {
    _id: string;
    email: string;
    productId: Types.ObjectId;
}

const schema = new Schema<Favorite>({
    email: { type: String, required: true },
    productId: { type: Types.ObjectId, required: true }
});
export const FavoriteModel = models.Favorite || model('Favorite', schema, 'favorites');