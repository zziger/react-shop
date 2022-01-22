import { HydratedDocument } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { User, UserModel } from "../../../models/User";
import { connectToDatabase } from "../../../src/database";
import { getUser } from "../../../src/user";
import { getFavoriteShopProducts } from "../products/getFavorites";
import sha256 from 'crypto-js/sha256';

type Data = User;

export async function getUserByCredentials(login: string, password: string): Promise<HydratedDocument<User> | undefined> {
    await connectToDatabase();
    const hashedPassword = sha256(password).toString();
    return await UserModel.findOne({ email: login, password: hashedPassword });
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method != "POST") return res.status(405).end();
    const user = await getUserByCredentials(req.body.login, req.body.password);
    if (!user) return res.status(403).end();
    res.status(200).json(user);
}