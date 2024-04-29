import Layout from '@/components/Layout'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { IRootState, persistor, store } from '@/redux/store'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import '@/styles/globals.css';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { DefaultEventsMap } from '@/types/Chat'
import { Socket, io } from 'socket.io-client'

// List of authentication routes
// const authRoutes = ['/auth/login','/auth/verify/:token','/auth/signup'];

export default function App({ Component, pageProps }: AppProps): JSX.Element {


  return (
    <ChakraProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor} >
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </PersistGate >
      </Provider>
    </ChakraProvider>
  )
}
