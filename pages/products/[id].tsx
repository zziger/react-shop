import { Box, Button, Grid, IconButton, Paper, Typography, TextField } from "@mui/material";
import { NextPage, GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import useSWR from "swr";
import { Layout } from "../../components/Layout";
import { ShopProduct } from "../../models/ShopProduct";
import { cleanObject, fetcher } from "../../src/utils";
import { getShopProduct } from "../api/products/[id]";
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarIcon from '@mui/icons-material/Star';
import { useDispatch, useSelector } from 'react-redux'
import { getCartItems, cartActions, getItemQty } from '../../store/cartSlice'
import { ShopFavoriteButton } from "../../src/products";
import { getUser } from "../../src/user";
import { useState } from "react";
import { getShopProductRates } from "../api/products/[id]/rate";
import { ShopProductRate } from "../../models/ShopProductRate";
import { User } from "../../models/User";

const RatingStarsButtons = (props: { rating: number; onRate(rating: number): void }) => {
    const { rating, onRate } = props;
    return <>
        <IconButton onClick={() => onRate(1)}>{rating < 0.5 ? <StarOutlineIcon /> : rating < 1 ? <StarHalfIcon /> : <StarIcon />}</IconButton>
        <IconButton onClick={() => onRate(2)}>{rating < 1.5 ? <StarOutlineIcon /> : rating < 2 ? <StarHalfIcon /> : <StarIcon />}</IconButton>
        <IconButton onClick={() => onRate(3)}>{rating < 2.5 ? <StarOutlineIcon /> : rating < 3 ? <StarHalfIcon /> : <StarIcon />}</IconButton>
        <IconButton onClick={() => onRate(4)}>{rating < 3.5 ? <StarOutlineIcon /> : rating < 4 ? <StarHalfIcon /> : <StarIcon />}</IconButton>
        <IconButton onClick={() => onRate(5)}>{rating < 4.5 ? <StarOutlineIcon /> : rating < 5 ? <StarHalfIcon /> : <StarIcon />}</IconButton>
    </>;
}

const RatingStars = (props: { rating: number }) => {
    const { rating } = props;
    return <>
        {rating < 0.5 ? <StarOutlineIcon /> : rating < 1 ? <StarHalfIcon /> : <StarIcon />}
        {rating < 1.5 ? <StarOutlineIcon /> : rating < 2 ? <StarHalfIcon /> : <StarIcon />}
        {rating < 2.5 ? <StarOutlineIcon /> : rating < 3 ? <StarHalfIcon /> : <StarIcon />}
        {rating < 3.5 ? <StarOutlineIcon /> : rating < 4 ? <StarHalfIcon /> : <StarIcon />}
        {rating < 4.5 ? <StarOutlineIcon /> : rating < 5 ? <StarHalfIcon /> : <StarIcon />}
    </>;
}

const Home: NextPage<{ product: ShopProduct, rates: ShopProductRate[]; user: User }> = (props) => {
    const itemQty = useSelector(getItemQty(props.product._id));
    const dispatch = useDispatch();
    const { status: sessionStatus, data: session } = useSession();
    const { data, mutate } = useSWR<ShopProduct>('/api/products/' + props.product._id, fetcher, { fallbackData: props.product });
    const { data: rates, mutate: mutateRates } = useSWR<ShopProductRate[]>('/api/products/' + props.product._id + '/rate', fetcher, { fallbackData: props.rates });
    const rated = rates!.find(e => e.user.toString() == props.user._id);
    const [ownRating, setOwnRating] = useState(rated?.rating ?? 0);
    const [commentText, setCommentText] = useState(rated?.comment ?? '');
    if (!data) return null;

    return <Layout>
        <Head>
            <title>{data.name}</title>
        </Head>
        <Box sx={{ padding: 4 }}>
            <Paper sx={{ padding: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <img src={data.image} style={{ width: '50%' }} />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography component="div" variant="h5">
                            {data.name}
                        </Typography>
                        <Typography component="div" color="text.secondary">
                            {data.price} $
                        </Typography>
                        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                            <RatingStars rating={data.rating ?? 0} /><Box sx={{ ml: 2 }}>{data.ratingCount ?? 0}</Box>
                        </Box>
                        <Box sx={{ mt: 5 }}>
                            {
                                itemQty > 0
                                    ? <Button onClick={() => dispatch(cartActions.removeItem(props.product._id))}>Usuń z koszyka</Button>
                                    : <Button onClick={() => dispatch(cartActions.addItem(props.product._id))}>Dodaj do koszyka</Button>
                            }
                            <ShopFavoriteButton product={data} size="small" />
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
            <Paper sx={{ mt: 5 }}>
                <Grid container >
                    {sessionStatus === "authenticated" && <Grid item>
                        <Box padding={4} sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column' }}>
                            <Box sx={{ mb: 2 }}>
                                <RatingStarsButtons onRate={async (n) => {
                                    setOwnRating(n);
                                }} rating={ownRating} />
                            </Box>
                            <TextField
                                label="Tekst komentarza"
                                multiline
                                maxRows={4}
                                sx={{ width: 300, mb: 1 }}
                                value={commentText}
                                onChange={e => setCommentText(e.target.value)}
                            />
                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                                <Button onClick={async () => {
                                    const request = await fetch(`/api/products/${props.product._id}/rate`, {
                                        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({
                                            rating: ownRating,
                                            comment: commentText
                                        })
                                    });
                                    if (!request.ok) alert('Komentarz nie został wysłany');
                                    mutate();
                                    mutateRates();
                                }}>{rated ? 'Edytuj' : 'Wyślij'}</Button>
                            </Box>
                        </Box>
                    </Grid>}
                    {rates!.filter(e => e.comment).map((e) =>
                        <Grid key={e._id} item xs={12} sx={{ paddingTop: 2, paddingBottom: 3, paddingLeft: 4, paddingRight: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Typography variant="h6">{e.userObject?.email}</Typography>
                                <Box><RatingStars rating={e.rating} /></Box>
                            </Box>
                            <Typography>{e.comment}</Typography>
                        </Grid>
                    )}
                </Grid>
            </Paper>
        </Box>

    </Layout>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    const user = session?.user?.email ? cleanObject(await getUser(session.user.email)) : null;
    try {
        if (typeof context.query.id != "string") return { notFound: true };
        const product = cleanObject(await getShopProduct(context.query.id, session?.user?.email ?? undefined));
        const rates = cleanObject(await getShopProductRates(context.query.id));
        return { props: { session, product, user, rates } };
    } catch (e) {
        return { notFound: true };
    }
}

export default Home;