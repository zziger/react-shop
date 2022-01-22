import { HydratedDocument } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import { ShopProduct, ShopProductModel } from '../../../models/ShopProduct'
import { connectToDatabase } from '../../../src/database';
import { getUser } from '../../../src/user';

type Data = ShopProduct[] | ShopProduct;

export async function getShopProducts(email?: string): Promise<ShopProduct[]> {
    await connectToDatabase();
    const products = (await ShopProductModel.find()).map(e => e.toObject());
    if (!products) throw Error('Nie udało się dostać wszystkie produkty');
    if (email) {
        const user = await getUser(email);
        const favorites = user.favorites.map(e => e.toString());

        for (const product of products) {
            product.favorite = favorites.includes(product._id.toString());
        }
    }
    return products;
}

export async function createShopProduct(product: ShopProduct): Promise<HydratedDocument<ShopProduct>> {
    await connectToDatabase();
    const document = new ShopProductModel(product);
    await document.save();
    return document;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === "PUT") {
        const session = await getSession({ req });
        if (!session?.user?.email) return res.status(401).end();
        const user = await getUser(session.user.email);
        if (!user?.toObject().admin) return res.status(403).end();
        const product = await createShopProduct(req.body as ShopProduct);
        return res.status(200).json(product);

    } else {
        const session = await getSession({ req });
        try {
            const products = await getShopProducts(session?.user?.email ?? undefined);
            res.status(200).json(products);
        } catch (e) {
            console.log(e);
            return res.status(500).end();
        }
    }
}
