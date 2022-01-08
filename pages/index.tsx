import type { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { Layout } from '../components/Layout'
import { getCartItems, cartActions } from '../store/cartSlice'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const items = useSelector(getCartItems);
  const dispatch = useDispatch();
  return (
    <Layout>
      <Head>
        <title>Strona internetowa</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <button onClick={() => dispatch(cartActions.addItem('test'))}>dodaj</button>
      {JSON.stringify(items)}
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  return { props: { session } }
}

export default Home
