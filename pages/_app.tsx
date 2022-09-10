import type { AppProps } from "next/app";
import Head from "next/head";
import { ChakraProvider } from "@chakra-ui/react";
import {
  WagmiConfig,
  configureChains,
  createClient,
  defaultChains,
} from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import SafeProvider from "@gnosis.pm/safe-apps-react-sdk";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
  alchemyProvider({ alchemyId: process.env.NEXT_PUBLIC_ALCHEMY }),
]);

const wagmiClient = createClient({
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SafeProvider>
      <WagmiConfig client={wagmiClient}>
        <Head>
          <title>Gnosis Safe Dashboard</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </WagmiConfig>
    </SafeProvider>
  );
}

export default MyApp;
