import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, IconButton, Typography } from '@mui/material'
import type { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import useSWRImmutable from 'swr/immutable'
import { Layout } from '../../components/Layout'
import { ShopProduct } from '../../models/ShopProduct'
import { cleanObject, fetcher } from '../../src/utils'
import { getCartItems, cartActions, getItemQty } from '../../store/cartSlice'
import styles from '../styles/Home.module.css'
import { getShopProducts } from '../api/products'
import { useEffect, useState } from 'react';
import { setProductFavorite, ShopFavoriteButton } from '../../src/products'
import { getFavoriteShopProducts } from '../api/products/getFavorites'
import { Product } from '..'
import { getUser } from '../../src/user'

const Home: NextPage<{ products: ShopProduct[] }> = (props) => {
  return (
    <Layout>
      <Head>
        <title>Produkty ulubione</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Grid container sx={{ padding: 4 }} spacing={4}>
        {props.products?.map(e => <Product key={e._id} product={e} />) ?? null}
      </Grid>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const user = session?.user?.email ? cleanObject(await getUser(session.user.email)) : null;
  if (!session?.user?.email) {
    return {
      notFound: true
    };
  }
  const products = cleanObject(await getFavoriteShopProducts(session!.user!.email));
  return { props: { session, products, user } }
}

export default Home
