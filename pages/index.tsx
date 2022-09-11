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
import { useNetwork, useAccount, useSwitchNetwork } from "wagmi";
import { ConnectorsModal } from "../components/ConnectorsModal";
import { SafeDashboard } from "../components/SafeDashboard";

const Home: NextPage = () => {
  const { chain } = useNetwork();
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();
  const { connector: activeConnector, address } = useAccount();

  return (
    <Box p={6}>
      <Box>
        <Heading size="md">Gnosis Safe Dashboard</Heading>
      </Box>
      <Box mt={4}>
        <ConnectorsModal />
      </Box>
      {chain && (
        <Alert mt={4} status="success">
          <AlertIcon as={MdCheckCircle} color="green.500" />
          <AlertDescription>
            Connected to {address} via {activeConnector?.name}
          </AlertDescription>
        </Alert>
      )}

      {switchNetwork && (
        <>
          {chains.map((x) => (
            <Button
              isLoading={isLoading && x.id === pendingChainId}
              mr={2}
              mt={4}
              key={x.id}
              onClick={() => switchNetwork(x.id)}
              disabled={x.id === chain?.id}
              colorScheme={x.id === chain?.id ? "green" : "gray"}
              loadingText={x.name}
            >
              {x.name}
            </Button>
          ))}

          {error && (
            <Alert status="error" mt={4}>
              <AlertIcon />
              <AlertDescription>{error.message}</AlertDescription>
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
