import { useState, useEffect, useCallback } from "react";
import {
  ButtonGroup,
  IconButton,
  Heading,
  Input,
  Box,
  List,
  ListItem,
  ListIcon,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { MdTagFaces, MdCheckCircle, MdDangerous } from "react-icons/md";
import { ethers } from "ethers";
import { useSigner, useEnsName } from "wagmi";
import Safe from "@gnosis.pm/safe-core-sdk";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";

const Address: React.FC<{ address: string }> = ({ address }) => {
  const ensName = useEnsName({
    address,
  });
  return <>{ensName.data || address}</>;
};

export const SafeDashboard: React.FC = () => {
  const { safe: safeInfo } = useSafeAppsSDK();
  const [safe, setSafe] = useState<Safe>();
  const { data: signer } = useSigner();
  const [newOwnerAddress, setNewOwnerAddress] = useState<string>();

  useEffect(() => {
    (async () => {
      if (signer && safeInfo.safeAddress) {
        const ethAdapter = new EthersAdapter({
          ethers,
          signer,
        });
        try {
          const safe = await Safe.create({
            ethAdapter,
            safeAddress: safeInfo.safeAddress,
          });
          setSafe(safe);
        } catch (e) {
          console.log(e);
        }
      } else {
        setSafe(undefined);
      }
    })();
  }, [signer, safeInfo.safeAddress]);

  const addNewOwner = useCallback(async () => {
    if (safe && newOwnerAddress) {
      const safeTransaction = await safe?.createAddOwnerTx({
        ownerAddress: newOwnerAddress,
      });
      const txResponse = await safe.executeTransaction(safeTransaction);
      await txResponse.transactionResponse?.wait();
    }
  }, [safe, newOwnerAddress]);

  return (
    <>
      <Box>
        {safeInfo.safeAddress ? (
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
      {safeInfo.safeAddress && (
        <>
          <Box mt={4}>Safe address: {safeInfo.safeAddress}</Box>
          <Box mt={4}>
            <Heading size="sm">Safe Owners:</Heading>
            <List spacing={3} mt={4}>
              {safeInfo.owners.map((owner) => (
                <ListItem key={owner}>
                  <ListIcon as={MdTagFaces} color="green.500" />
                  <Address address={owner} />
                </ListItem>
              ))}
            </List>
          </Box>
        </>
      )}
      {safe && (
        <>
          <ButtonGroup mt={4} variant="outline">
            <Input
              placeholder="New owner address"
              onChange={(event) => setNewOwnerAddress(event.target.value)}
            />
            <IconButton
              aria-label="Add new owner"
              icon={<AddIcon />}
              onClick={addNewOwner}
            />
          </ButtonGroup>
        </>
      )}
    </>
  );
};
