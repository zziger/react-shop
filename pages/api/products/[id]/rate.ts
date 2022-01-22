import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import products from "..";
import { ShopProduct, ShopProductModel } from "../../../../models/ShopProduct";
import { ShopProductRate, ShopProductRateModel } from "../../../../models/ShopProductRate";
import { connectToDatabase } from "../../../../src/database";
import { getUser } from "../../../../src/user";
import { getUsersByIds } from "../../users/getBulk";

type Data = ShopProductRate | ShopProductRate[];

export async function rateShopProduct(id: string, userId: string, rating: number, comment?: string): Promise<ShopProductRate> {
    await connectToDatabase();
    const product = (await ShopProductModel.findById(id)).toObject();
    if (!product) throw Error('Nie udało się znaleźć produkt ' + id);
    const productObjectId = new Types.ObjectId(id);
    const userObjectId = new Types.ObjectId(userId);
    await ShopProductRateModel.deleteMany({ user: userObjectId });
    const rate = new ShopProductRateModel({
        product: productObjectId,
        user: userObjectId,
        rating,
        comment
    });
    await rate.save();
    return rate;
}
export async function getShopProductRates(id: string): Promise<ShopProductRate[]> {
    await connectToDatabase();
    const rates = (await ShopProductRateModel.find({ product: new Types.ObjectId(id) })).map(e => e.toObject());
    const ids = rates.map(e => e.user);
    const users = await getUsersByIds(ids);
    for (const rate of rates) {
        rate.userObject = users[rate.user];
    }
    return rates;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (typeof req.query.id != "string") return res.status(400).end();

    if (req.method === "POST") {
        const session = await getSession({ req });
        if (!session?.user?.email) return res.status(401).end();
        const user = await getUser(session.user.email);
        const data = req.body;
        if (isNaN(data.rating) || data.rating < 1 || data.rating > 5) return res.status(400).end();
        await rateShopProduct(req.query.id, user.toObject()._id, data.rating, data.comment);
        return res.status(204).end()
    } else if (req.method === "GET") {
        return res.status(200).json(await getShopProductRates(req.query.id));
    } else {
        res.status(405).end();
    }
}
