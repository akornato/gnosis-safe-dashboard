import { useState, useEffect, useCallback } from "react";
import {
  ButtonGroup,
  IconButton,
  Heading,
  InputGroup,
  Input,
  InputLeftAddon,
  Box,
  List,
  ListItem,
  ListIcon,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { MdTagFaces, MdCheckCircle } from "react-icons/md";
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
  const [safeAddress, setSafeAddress] = useState<string>("");
  const [error, setError] = useState<Error>();
  const [safe, setSafe] = useState<Safe>();
  const [owners, setOwners] = useState<string[]>();
  const { data: signer } = useSigner();
  const [newOwnerAddress, setNewOwnerAddress] = useState<string>();

  useEffect(() => {
    setSafeAddress(safeInfo.safeAddress);
  }, [safeInfo.safeAddress]);

  useEffect(() => {
    (async () => {
      if (signer && safeAddress) {
        setError(undefined);
        const ethAdapter = new EthersAdapter({
          ethers,
          signer,
        });
        try {
          const safe = await Safe.create({
            ethAdapter,
            safeAddress: safeAddress,
          });
          setSafe(safe);
          safe.getOwners().then(setOwners).catch(console.log);
        } catch (e: any) {
          setError(e);
          setSafe(undefined);
        }
      } else {
        setSafe(undefined);
      }
    })();
  }, [signer, safeAddress]);

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
      <InputGroup>
        <InputLeftAddon>Safe address</InputLeftAddon>
        <Input
          value={safeAddress}
          onChange={(event) => setSafeAddress(event.target.value)}
        />
      </InputGroup>

      {error && (
        <Alert mt={4} status="error">
          <AlertIcon />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <Box mt={4}>
        {safe ? (
          <Alert status="success">
            <AlertIcon as={MdCheckCircle} color="green.500" />
            <AlertDescription>Gnosis Safe detected!</AlertDescription>
          </Alert>
        ) : (
          <Alert status="error">
            <AlertIcon />
            <AlertDescription>Gnosis Safe not detected!</AlertDescription>
          </Alert>
        )}
      </Box>

      {safe && owners && (
        <>
          <Box mt={4}>
            <Heading size="sm">Safe Owners:</Heading>
            <List spacing={3} mt={4}>
              {owners.map((owner) => (
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
