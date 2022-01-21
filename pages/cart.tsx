import { Box, Paper, Grid, Typography, IconButton } from "@mui/material";
import { NextPage, GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from 'next/head';
import { useDispatch, useSelector } from "react-redux";
import useSWR from "swr";
import { Layout } from "../components/Layout";
import { ShopProduct } from "../models/ShopProduct";
import { cleanObject, fetcher } from "../src/utils";
import { cartActions, CartElement, getCartItems, getItemQty } from "../store/cartSlice";
import DeleteIcon from '@mui/icons-material/Delete';
import useSWRImmutable from 'swr/immutable';
import { useState, useEffect } from "react";
import Link from 'next/link';
import { getUser } from "../src/user";

const CartItem = (props: { element: CartElement }) => {
    const { element } = props;
    const qty = useSelector(getItemQty(element.id));
    const dispatch = useDispatch();

    return <Grid item xs={12}>
        <Paper sx={{ width: '100%', padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <img src={element.product!.image} style={{ height: 55 }} />
                <Link href={"/products/" + element.id}><span style={{ cursor: 'pointer' }}>{element.product!.name}</span></Link>
                <span>${element.product!.price.toFixed(2)}</span>
                <input
                    type="number"
                    min={1}
                    max={100}
                    value={qty}
                    onChange={(e) =>
                        +e.currentTarget.value > 0 &&
                        dispatch(cartActions.changeItemQty({ id: element.id, qty: +e.currentTarget.value }))
                    } />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <span>${(element.product!.price * qty).toFixed(2)}</span>
                <IconButton onClick={() => dispatch(cartActions.removeItem(element.id))}><DeleteIcon /></IconButton>
            </Box>
        </Paper>
    </Grid>
}

const Cart: NextPage<{ products: ShopProduct[] }> = (props) => {
    const cartItems = cleanObject(useSelector(getCartItems));
    const [data, setData] = useState<Record<string, ShopProduct>>({});

    useEffect(() => {
        (async () => {
            const body = JSON.stringify(cartItems.map(e => e.id));
            setData(await fetcher('/api/products/getBulk', { headers: { 'content-type': 'application/json' }, method: 'POST', body }));
        })();
    }, []);

    if (data) {
        for (const cartItem of cartItems) {
            if (cartItem.id in data) cartItem.product = data[cartItem.id];
        }
    }

    const sum = cartItems.filter(e => e.product).reduce((prev, curr) => prev + (curr.product!.price * curr.qty), 0);

    return (
        <Layout>
            <Head>
                {/* <title>{data.name}</title> */}
            </Head>
            <Box sx={{ padding: 4 }}>
                <Grid container spacing={2}>
                    {cartItems.filter(e => e.product).map(e => <CartItem key={e.id} element={e} />)}
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Paper sx={{ padding: 2 }}>
                            ${sum.toFixed(2)}
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    const user = session?.user?.email ? cleanObject(await getUser(session.user.email)) : null;
    return { props: { session, user } }
}

export default Cart