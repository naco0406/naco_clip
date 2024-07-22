import '@/styles/globals.css'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import { Toaster } from "@/components/ui/toaster"

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>Naco Clip</title>
                <meta name="description" content="A clipboard manager and notepad application" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Component {...pageProps} />
            <Toaster />
        </>
    )
}