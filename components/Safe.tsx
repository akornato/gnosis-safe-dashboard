import { useEffect } from "react";
import {
  Heading,
  Box,
  List,
  ListItem,
  ListIcon,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import { MdTagFaces, MdCheckCircle, MdDangerous } from "react-icons/md";
import { useAccount, useEnsName } from "wagmi";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";

const Owner: React.FC<{ address: string }> = ({ address }) => {
  const ensName = useEnsName({
    address,
  });
  return <>{ensName.data || address}</>;
};

export const Safe: React.FC = () => {
  const { sdk, connected, safe } = useSafeAppsSDK();
  const { data: accountData } = useAccount();
  const { data: ensNameData } = useEnsName({ address: accountData?.address });

  useEffect(() => {
    if (connected) {
      sdk.safe.requestAddressBook().then(console.log).catch(console.log);
    }
  }, [connected, sdk.safe]);

  return (
    <>
      <Box mb={4}>
        {connected ? (
          <Alert status="success">
            <AlertIcon as={MdCheckCircle} color="green.500" />
            <AlertDescription>Gnosis Safe detected!</AlertDescription>
          </Alert>
        ) : (
          <Alert status="error">
            <AlertIcon as={MdDangerous} color="red.500" />
            <AlertDescription>Gnosis Safe not detected!</AlertDescription>
          </Alert>
        )}
      </Box>
      {connected && (
        <>
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
    </>
  );
};
