import Head from "next/head";
import { ChakraProvider } from "@chakra-ui/react";
import { getDefaultProvider } from "ethers";
import { WagmiConfig, createClient } from "wagmi";
import SafeProvider from "@gnosis.pm/safe-apps-react-sdk";
import type { AppProps } from "next/app";

const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Gnosis Safe Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SafeProvider>
        <WagmiConfig client={client}>
          <ChakraProvider>
            <Component {...pageProps} />
          </ChakraProvider>
        </WagmiConfig>
      </SafeProvider>
    </>
  );
}

export default MyApp;
