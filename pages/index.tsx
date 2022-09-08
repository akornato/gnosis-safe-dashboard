import React, { useEffect } from "react";
import type { NextPage } from "next";
import {
  Heading,
  Box,
  Button,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import { useConnect, useNetwork } from "wagmi";
import { ConnectorsModal } from "../components/ConnectorsModal";
import { Transaction } from "../components/Transaction";
import { Safe } from "../components/Safe";

const Home: NextPage = () => {
  const { activeConnector, connect, connectors } = useConnect();
  const {
    activeChain,
    chains,
    error: networkError,
    isLoading,
    pendingChainId,
    switchNetwork,
  } = useNetwork();

  useEffect(() => {
    // autoconnect wagmi to Safe if available
    const connectorInstance = connectors.find(
      (c) => c.id === "safe" && c.ready
    );
    if (connectorInstance) {
      connect({ connector: connectorInstance });
    }
  }, [connect, connectors]);

  return (
    <Box p={6}>
      <Box mb={4}>
        <Heading size="md">Gnosis Safe Dashboard</Heading>
      </Box>

      {activeChain && (
        <Box mb={4}>
          Connected to {activeChain.name ?? activeChain.id} via{" "}
          {activeConnector?.name}
          {activeChain?.unsupported && " (unsupported)"}
        </Box>
      )}
      <Box mb={4}>
        <ConnectorsModal />
      </Box>

      {switchNetwork && (
        <>
          {chains.map((x) => (
            <Button
              mr={4}
              mb={4}
              key={x.id}
              onClick={() => switchNetwork(x.id)}
              disabled={x.id === activeChain?.id}
              colorScheme={x.id === activeChain?.id ? "green" : "gray"}
            >
              {x.name}
              {isLoading && x.id === pendingChainId && " (switching)"}
            </Button>
          ))}

          {networkError && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              <AlertDescription>{networkError.message}</AlertDescription>
            </Alert>
          )}
        </>
      )}

      {activeConnector && (
        <Box mb={4}>
          <Transaction />
        </Box>
      )}

      <Safe />
    </Box>
  );
};

export default Home;
