import { NextApiRequest, NextApiResponse } from "next";
import products from ".";
import { ShopProduct, ShopProductModel } from "../../../models/ShopProduct";
import { connectToDatabase } from "../../../src/database";

type Data = ShopProduct;

export async function getShopProduct(id: string): Promise<Data> {
    await connectToDatabase();
    const product = await ShopProductModel.findById(id);
    if (!product) throw Error('Nie udało się dostać produkt ' + id);
    return product;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (typeof req.query.id != "string") return res.status(400).end();
    try {
        const products = await getShopProduct(req.query.id);
        res.status(200).json(products);
    } catch(e) {
        console.log(e);
        return res.status(404).end();
    }
}
