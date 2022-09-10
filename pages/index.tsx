import React from "react";
import type { NextPage } from "next";
import {
  Heading,
  Box,
  Button,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";
import { useConnect, useNetwork } from "wagmi";
import { ConnectorsModal } from "../components/ConnectorsModal";
import { SafeDashboard } from "../components/SafeDashboard";

const Home: NextPage = () => {
  const { activeConnector } = useConnect();
  const {
    activeChain,
    chains,
    error: networkError,
    isLoading,
    pendingChainId,
    switchNetwork,
  } = useNetwork();

  return (
    <Box p={6}>
      <Box>
        <Heading size="md">Gnosis Safe Dashboard</Heading>
      </Box>
      <Box mt={4}>
        <ConnectorsModal />
      </Box>
      {activeChain && (
        <Alert mt={4} status="success">
          <AlertIcon as={MdCheckCircle} color="green.500" />
          <AlertDescription>
            Connected to {activeChain.name ?? activeChain.id} via{" "}
            {activeConnector?.name}
          </AlertDescription>
        </Alert>
      )}

      {switchNetwork && (
        <>
          {chains.map((x) => (
            <Button
              mr={4}
              mt={4}
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
            <Alert status="error" mt={4}>
              <AlertIcon />
              <AlertDescription>{networkError.message}</AlertDescription>
            </Alert>
          )}
        </>
      )}

      {activeConnector && (
        <Box mt={4}>
          <SafeDashboard />
        </Box>
      )}
    </Box>
  );
};

export default Home;
