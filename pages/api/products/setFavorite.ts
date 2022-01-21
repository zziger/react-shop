import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import { FavoriteModel } from '../../../models/Favorite';
import { ShopProduct, ShopProductModel } from '../../../models/ShopProduct'
import { connectToDatabase } from '../../../src/database';
import { getUser } from '../../../src/user';
import { Types } from 'mongoose';

export async function setProductIsFavorite(email: string, id: string, state: boolean): Promise<void> {
    await connectToDatabase();
    const user = await getUser(email);
    if (state) {
         if (!user.favorites.some(e => e._id.toString() == id))
            user.favorites.push(new Types.ObjectId(id));
    } else {
        user.favorites = user.favorites.filter(e => e._id.toString() != id)
    }
    await user.save();
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<void>
) {
    if (req.method != "POST") return res.status(405).end();

    const session = await getSession({ req });
    if (!session?.user?.email) return res.status(401).end();

    const data = req.body;
    try {
        await setProductIsFavorite(session!.user!.email, data.id, data.state);
        res.status(204).end();
    } catch(e) {
        console.log(e);
        return res.status(500).end();
    }
}
