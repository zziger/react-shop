import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, IconButton, Typography } from '@mui/material'
import type { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import useSWR from 'swr'
import { Layout } from '../components/Layout'
import { ShopProduct } from '../models/ShopProduct'
import { cleanObject, fetcher } from '../src/utils'
import { getCartItems, cartActions, getItemQty } from '../store/cartSlice'
import styles from '../styles/Home.module.css'
import { getShopProducts } from './api/products'
import { useEffect, useState } from 'react';
import { setProductFavorite, ShopFavoriteButton } from '../src/products'
import { getUser } from '../src/user'

export const Product = (props: { product: ShopProduct }) => {
  const itemQty = useSelector(getItemQty(props.product._id));
  const dispatch = useDispatch();

  return <Grid item xs={12} sm={6} lg={3} sx={{ display: 'flex', justifyContent: 'center' }}>
    <Card sx={{ maxWidth: { lg: 350 }, width: '100%' }}>
      <CardMedia component="img" image={props.product.image} alt={props.product.name} height={150} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {props.product.name}
        </Typography>
        <Typography color="text.secondary">
          {props.product.price}
        </Typography>
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between', paddingLeft: 2, paddingRight: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {
            itemQty > 0
              ? <Button size="small" onClick={() => dispatch(cartActions.removeItem(props.product._id))}>Usuń z koszyka</Button>
              : <Button size="small" onClick={() => dispatch(cartActions.addItem(props.product._id))}>Dodaj do koszyka</Button>
          }
          <ShopFavoriteButton product={props.product} size="small" />
        </Box>
        <Link href={"/products/" + props.product._id}><Button size="small">Otwórz</Button></Link>
      </CardActions>
    </Card>
  </Grid>
}

const Home: NextPage<{ products: ShopProduct[] }> = (props) => {
  const { data, error } = useSWR<ShopProduct[]>('/api/products', fetcher, { fallbackData: props.products });
  return (
    <Layout>
      <Head>
        <title>Strona internetowa</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Grid container sx={{ padding: 4 }} spacing={4}>
        {data?.map(e => <Product key={e._id} product={e} />) ?? null}
      </Grid>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const user = session?.user?.email ? cleanObject(await getUser(session.user.email)) : null;
  const products = cleanObject(await getShopProducts(session?.user?.email ?? undefined));
  return { props: { session, user, products } }
}

export default Home
