import Layout from '@/components/Layout';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react';
import { UIProvider } from '@/context/UIContext';
import ItemModal from '@/components/ItemModal';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <UIProvider>
        <Layout>
          <ItemModal />
          <Component {...pageProps} />
        </Layout>
      </UIProvider>
      <Toaster />
    </SessionProvider>
  );
}
