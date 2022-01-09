import type { NextApiRequest, NextApiResponse } from 'next'
import { FavoriteModel } from '../../../models/Favorite';
import { ShopProduct, ShopProductModel } from '../../../models/ShopProduct'
import { connectToDatabase } from '../../../src/database';

export async function setProductIsFavorite(userEmail: string, id: string, state: boolean): Promise<void> {
    await connectToDatabase();
    if (!state) {
        await FavoriteModel.deleteMany({ productId: id });
    } else {
        const favorite = await FavoriteModel.findOne({ productId: id});
        if (!favorite) {
            const model = new FavoriteModel({ email: userEmail, productId: id });
            await model.save();
        }
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<void>
) {
    if (req.method != "POST") return;
    const data = req.body;
    try {
        await setProductIsFavorite(data.email, data.id, data.state);
        res.status(204).end();
    } catch(e) {
        console.log(e);
        return res.status(500).end();
    }
}
