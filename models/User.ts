import { model, Model, models, Schema, Types } from "mongoose";

export interface User {
    _id: string;
    email: string;
    favorites: Types.ObjectId[];
    admin?: boolean;
    password?: string;
}

const schema = new Schema<User>({
    email: { type: String, required: true },
    favorites: [ Types.ObjectId ],
    admin: { type: Boolean, required: false },
    password: { type: String, required: false }
});
export const UserModel = models.User || model('User', schema, 'users');