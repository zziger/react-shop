import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import products from "..";
import { ShopProduct, ShopProductModel } from "../../../../models/ShopProduct";
import { ShopProductRateModel } from "../../../../models/ShopProductRate";
import { connectToDatabase } from "../../../../src/database";
import { getUser } from "../../../../src/user";

type Data = ShopProduct;

export async function getShopProduct(id: string, email?: string): Promise<Data> {
    await connectToDatabase();
    const product = (await ShopProductModel.findById(id)).toObject();
    if (!product) throw Error('Nie udało się dostać produkt ' + id);
    if (email) {
        const user = await getUser(email);
        product.favorite = user.favorites.some(e => e._id.toString() == id);
        const ownRating = await ShopProductRateModel.findOne({ user: user._id });
        product.ownRating = ownRating?.rating;
    }

    const rating = await ShopProductRateModel.aggregate([
        {
            '$match': {
                'product': new Types.ObjectId(id)
            }
        },
        {
            '$group': {
                '_id': 0,
                'avg': {
                    '$avg': '$rating'
                },
                'count': {
                    '$count': {}
                }
            }
        }
    ]);

    product.rating = rating?.[0]?.avg;
    product.ratingCount = rating?.[0]?.count;
    return product;
}

export async function editShopProduct(id: string, field: string, value: any): Promise<void> {
    await connectToDatabase();
    const product = await ShopProductModel.findById(id);
    if (!product) throw Error('Nie udało się dostać produkt ' + id);
    product.set(field, value);
    await product.save();
}

export async function deleteShopProduct(id: string): Promise<void> {
    await connectToDatabase();
    await ShopProductModel.findByIdAndDelete(id);
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
        if (!user?.toObject().admin) return res.status(403).end();
        const data = req.body;
        editShopProduct(req.query.id, data.field, data.value);
        return res.status(204).end()

    } if (req.method === "DELETE") {
        const session = await getSession({ req });
        if (!session?.user?.email) return res.status(401).end();
        const user = await getUser(session.user.email);
        if (!user?.toObject().admin) return res.status(403).end();
        deleteShopProduct(req.query.id);
        return res.status(204).end();

    } else {
        if (typeof req.query.id != "string") return res.status(400).end();
        const session = await getSession({ req });
        try {
            const products = await getShopProduct(req.query.id, session?.user?.email ?? undefined);
            res.status(200).json(products);
        } catch (e) {
            console.log(e);
            return res.status(404).end();
        }
    }
}
