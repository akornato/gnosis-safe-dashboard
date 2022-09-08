import React, { useEffect } from "react";
import type { NextPage } from "next";
import {
  Heading,
  Box,
  Button,
  List,
  ListItem,
  ListIcon,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import { MdTagFaces, MdCheckCircle } from "react-icons/md";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { useAccount, useConnect, useEnsName, useNetwork } from "wagmi";
import { ConnectorsModal } from "../components/ConnectorsModal";
import { Transaction } from "../components/Transaction";

const Owner: React.FC<{ address: string }> = ({ address }) => {
  const ensName = useEnsName({
    address,
  });
  return <>{ensName.data || address}</>;
};

const Safe: NextPage = () => {
  const { sdk, connected: safeConnected, safe } = useSafeAppsSDK();
  const { activeConnector, connect, connectors } = useConnect();
  const { data: accountData } = useAccount();
  const { data: ensNameData } = useEnsName({ address: accountData?.address });
  const {
    activeChain,
    chains,
    error: networkError,
    isLoading,
    pendingChainId,
    switchNetwork,
  } = useNetwork();

  useEffect(() => {
    if (safeConnected) {
      sdk.safe.requestAddressBook().then(console.log).catch(console.log);
    }
  }, [safeConnected, sdk.safe]);

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

      {safeConnected && (
        <>
          <Box mb={4}>
            <Alert status="success">
              <AlertIcon as={MdCheckCircle} color="green.500" />
              <AlertDescription>Gnosis Safe detected!</AlertDescription>
            </Alert>
          </Box>
          <Box mb={4}>
            Safe address connected: {ensNameData ?? accountData?.address}
            {ensNameData ? ` (${accountData?.address})` : null}
          </Box>
          <Heading size="md">Safe Owners:</Heading>
          <List spacing={3} pt={4}>
            {safe.owners.map((owner) => (
              <ListItem key={owner}>
                <ListIcon as={MdTagFaces} color="green.500" />
                <Owner address={owner} />
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Box>
  );
};

export default Safe;
