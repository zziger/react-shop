import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import { FavoriteModel } from '../../../models/Favorite';
import { ShopProduct, ShopProductModel } from '../../../models/ShopProduct'
import { connectToDatabase } from '../../../src/database';

type Data = ShopProduct[];

export async function getShopProducts(email?: string): Promise<ShopProduct[]> {
    await connectToDatabase();
    const products = (await ShopProductModel.find()).map(e => e.toObject());
    if (!products) throw Error('Nie udało się dostać wszystkie produkty');
    if (email) {
        const favorites = (await FavoriteModel.find({ email })).map(e => e.productId.toString());

        for (const product of products) {
            product.favorite = favorites.includes(product._id.toString());
        }
    }
    return products;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const session = await getSession({ req });
    try {
        const products = await getShopProducts(session?.user?.email ?? undefined);
        res.status(200).json(products);
    } catch(e) {
        console.log(e);
        return res.status(500).end();
    }
}
