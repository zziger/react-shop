import { HydratedDocument } from "mongoose";
import { UserModel, User } from "../models/User";
import { connectToDatabase } from "./database";

export async function getUser(email: string): Promise<HydratedDocument<User>> {
    await connectToDatabase();
    let user = await UserModel.findOne({ email });
    if (!user) {
        user = new UserModel();
        user.email = email;
        await user.save();
    }

    return user;
}
