import { HydratedDocument } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { User, UserModel } from "../../../models/User";
import { connectToDatabase } from "../../../src/database";
import { getUser } from "../../../src/user";
import { getFavoriteShopProducts } from "../products/getFavorites";

type Data = User[];

export async function editUser(id: string, field: string, value: any): Promise<void> {
    await connectToDatabase();
    const user = await UserModel.findById(id);
    if (!user) return;
    user.set(field, value);
    await user.save();
}

export async function deleteUser(id: string): Promise<void> {
    await connectToDatabase();
    await UserModel.findByIdAndDelete(id);
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (typeof req.query.id != "string") return res.status(400).end();

    const session = await getSession({ req });
    if (!session?.user?.email) return res.status(401).end();
    const user = await getUser(session.user.email);
    if (!user.toObject().admin) return res.status(403).end();

    if (req.method === "POST") {
        const data = req.body;
        if (req.query.id.toLowerCase() === user._id.toString()) return res.status(400).end();
        await editUser(req.query.id, data.field, data.value);
        return res.status(204).end();
    } else if (req.method === "DELETE") {
        if (req.query.id.toLowerCase() === user._id.toString()) return res.status(400).end();
        await deleteUser(req.query.id);
        return res.status(204).end();
    } else {
        return res.status(405).end();
    }
}