import { HydratedDocument } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { User, UserModel } from "../../../models/User";
import { connectToDatabase } from "../../../src/database";
import { getUser } from "../../../src/user";
import { getFavoriteShopProducts } from "../products/getFavorites";
import sha256 from 'crypto-js/sha256';

type Data = User;

export async function createUser(login: string, password: string): Promise<HydratedDocument<User> | undefined> {
    if (!login?.trim()) throw Error('ENTER_LOGIN');
    if (!password?.trim()) throw Error('ENTER_PASSWORD');

    await connectToDatabase();
    
    const oldUser = await UserModel.findOne({ email: login });
    if (oldUser) throw Error('EMAIL_ALREADY_IN_USE');

    const hashedPassword = sha256(password).toString();
    const user = new UserModel({
        email: login,
        password: hashedPassword
    });
    await user.save();
    return user;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<User | { ok: false, error: string }>
) {
    if (req.method != "POST") return res.status(405).end();
    try {
        const user = await createUser(req.body.email, req.body.password);
        if (!user) return res.status(500).end();
        res.status(200).json(user);
    } catch(e) {
        res.status(403).json({ ok: false, error: typeof e == "object" ? (e as any).message : String(e) });
    }
}
