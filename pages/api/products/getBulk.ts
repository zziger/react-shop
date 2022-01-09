import type { NextApiRequest, NextApiResponse } from 'next'
import { ShopProduct, ShopProductModel } from '../../../models/ShopProduct'
import { connectToDatabase } from '../../../src/database';

type Data = Record<string, ShopProduct>;

export async function getShopProductsByIds(ids: string[]): Promise<Data> {
    await connectToDatabase();
    const products = await ShopProductModel.find({ _id: { $in: ids } });
    return Object.fromEntries(products.map(e => [e._id, e]))
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== "POST") return res.status(404).end();
    const data = req.body;
    if (!data || !Array.isArray(data)) return res.status(400).end();

    try {
        const products = await getShopProductsByIds(data);
        res.status(200).json(products);
    } catch(e) {
        console.log(e);
        return res.status(500).end();
    }
}
