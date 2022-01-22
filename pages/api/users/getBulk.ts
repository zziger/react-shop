import type { NextApiRequest, NextApiResponse } from 'next'
import { ShopProduct, ShopProductModel } from '../../../models/ShopProduct'
import { User, UserModel } from '../../../models/User';
import { connectToDatabase } from '../../../src/database';

type Data = Record<string, User>;

export async function getUsersByIds(ids: string[]): Promise<Data> {
    await connectToDatabase();
    const users = await UserModel.find({ _id: { $in: ids } });
    return Object.fromEntries(users.map(e => [e._id, e]))
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    return res.status(404).end();
}
