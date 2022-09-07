import type { AppProps } from "next/app";
import Head from "next/head";
import { ChakraProvider } from "@chakra-ui/react";
import SafeProvider from "@gnosis.pm/safe-apps-react-sdk";
import {
  WagmiConfig,
  configureChains,
  createClient,
  defaultChains,
} from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { SafeConnector } from "@gnosis.pm/safe-apps-wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
  alchemyProvider({ alchemyId: process.env.NEXT_PUBLIC_ALCHEMY }),
]);

const wagmiClient = createClient({
  autoConnect: false, // Wagmi library automatically connects to the last used provider, but instead we want to automatically connect to the Safe if the app is loaded in the Safe Context.
  connectors: [
    new SafeConnector({ chains }),
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
