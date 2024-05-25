import Layout from '@/components/Layout'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { persistor, store } from '@/redux/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import '@/styles/globals.css';

// List of authentication routes
// const authRoutes = ['/auth/login','/auth/verify/:token','/auth/signup'];

export default function App({ Component, pageProps }: AppProps): JSX.Element {

   const metadata = {
    title: 'Spicecraft Catering service',
    description: 'Indian Caterer Service Provider in Sydney Australia, Offer varity indian dishes',
  }

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
