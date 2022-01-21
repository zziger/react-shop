import { HydratedDocument } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { User, UserModel } from "../../../models/User";
import { connectToDatabase } from "../../../src/database";
import { getUser } from "../../../src/user";
import { getFavoriteShopProducts } from "../products/getFavorites";

type Data = User[];

export async function getUsers(): Promise<HydratedDocument<User>[]> {
    await connectToDatabase();
    const users = await UserModel.find({});
    return users;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const session = await getSession({ req });
    if (!session?.user?.email) return res.status(401).end();
    const user = await getUser(session.user.email);
    if (!user.toObject().admin) return res.status(403).end();

    try {
        const users = await getUsers();
        res.status(200).json(users);
    } catch(e) {
        console.log(e);
        return res.status(500).end();
    }
}