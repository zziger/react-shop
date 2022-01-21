import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { UserContext } from '../src/UserContext';

function MyApp({ Component, pageProps }: AppProps) {
  return <SessionProvider session={pageProps.session}>
    <UserContext.Provider value={pageProps.user ?? null}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </UserContext.Provider>
  </SessionProvider>;
}

export default MyApp;
