import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import { ShopProduct, ShopProductModel } from '../../../models/ShopProduct'
import { connectToDatabase } from '../../../src/database';
import { getUser } from '../../../src/user';

type Data = ShopProduct[];

export async function getFavoriteShopProducts(email: string): Promise<ShopProduct[]> {
    await connectToDatabase();
    const products = (await ShopProductModel.find()).map(e => e.toObject());
    if (!products) throw Error('Nie udało się dostać ulubione produkty');
    const user = await getUser(email);
    const favorites = user.favorites.map(e => e.toString());
    
    for (const product of products) {
        product.favorite = favorites.includes(product._id.toString());
    }

    return products.filter(p => p.favorite);
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const session = await getSession({ req });
    if (!session?.user?.email) {
        return res.status(401).end();
    }

    try {
        const products = await getFavoriteShopProducts(session?.user?.email ?? undefined);
        res.status(200).json(products);
    } catch(e) {
        console.log(e);
        return res.status(500).end();
    }
}
