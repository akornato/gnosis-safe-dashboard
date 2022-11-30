import Head from "next/head";
import { ChakraProvider } from "@chakra-ui/react";
import {
  defaultChains,
  WagmiConfig,
  createClient,
  configureChains,
} from "wagmi";
import SafeProvider from "@gnosis.pm/safe-apps-react-sdk";
import { alchemyProvider } from "wagmi/providers/alchemy";
import type { AppProps } from "next/app";

const { provider } = configureChains(defaultChains, [
  alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY }),
]);

const client = createClient({
  autoConnect: true,
  provider,
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
