import { Box, Button, Grid, IconButton, Paper, Typography } from "@mui/material";
import { NextPage, GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import useSWR from "swr";
import { Layout } from "../../components/Layout";
import { ShopProduct } from "../../models/ShopProduct";
import { cleanObject, fetcher } from "../../src/utils";
import { getShopProduct } from "../api/products/[id]";
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import { useDispatch, useSelector } from 'react-redux'
import { getCartItems, cartActions, getItemQty } from '../../store/cartSlice'

const Home: NextPage<{ product: ShopProduct }> = (props) => {
    const itemQty = useSelector(getItemQty(props.product._id));
    const dispatch = useDispatch();
    const { data } = useSWR('/api/products/' + props.product._id, fetcher, { fallbackData: props.product });
    return <Layout>
        <Head>
            <title>{data.name}</title>
        </Head>
        <Box sx={{ padding: 4 }}>
            <Paper sx={{ padding: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <img src={data.image} style={{ width: '100%' }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography component="div" variant="h5">
                            {data.name}
                        </Typography>
                        <Typography component="div" color="text.secondary">
                            5$
                        </Typography>
                        <Box>
                            {
                                itemQty > 0
                                    ? <Button onClick={() => dispatch(cartActions.removeItem(props.product._id))}>Usuń z koszyka</Button>
                                    : <Button onClick={() => dispatch(cartActions.addItem(props.product._id))}>Dodaj do koszyka</Button>
                            }
                            <IconButton><StarOutlineIcon /></IconButton>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>

    </Layout>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    try {
        if (typeof context.query.id != "string") return { notFound: true };
        const product = cleanObject(await getShopProduct(context.query.id));
        return { props: { session, product } };
    } catch (e) {
        return { notFound: true };
    }
}

export default Home;