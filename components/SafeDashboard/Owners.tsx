import { useEffect, useState, useCallback } from "react";
import Safe from "@gnosis.pm/safe-core-sdk";
import { useEnsName } from "wagmi";
import {
  ButtonGroup,
  IconButton,
  Heading,
  Input,
  Box,
  List,
  ListItem,
  ListIcon,
  Tooltip,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { MdTagFaces } from "react-icons/md";

const Address: React.FC<{ address: string }> = ({ address }) => {
  const ensName = useEnsName({
    address,
  });
  return <>{ensName.data || address}</>;
};

export const Owners: React.FC<{
  safe: Safe;
}> = ({ safe }) => {
  const [owners, setOwners] = useState<string[]>([]);
  const [newOwnerAddress, setNewOwnerAddress] = useState<string>();
  const [error, setError] = useState<Error>();
  const [ownersLoading, setOwnersLoading] = useState<string[]>([]);

  useEffect(() => {
    try {
      setError(undefined);
      safe.getOwners().then(setOwners).catch(console.log);
    } catch (e: any) {
      setError(e);
    }
  }, [safe]);

  const addNewOwner = useCallback(async () => {
    if (newOwnerAddress) {
      try {
        setError(undefined);
        const safeTransaction = await safe?.createAddOwnerTx({
          ownerAddress: newOwnerAddress,
        });
        const txResponse = await safe.executeTransaction(safeTransaction);
        await txResponse.transactionResponse?.wait();
        setOwners(await safe.getOwners());
      } catch (e: any) {
        setError(e);
      }
    }
  }, [safe, newOwnerAddress]);

  const removeOwner = useCallback(
    async (ownerAddress: string) => {
      try {
        setError(undefined);
        setOwnersLoading((ownersLoading) => [...ownersLoading, ownerAddress]);
        const safeTransaction = await safe.createRemoveOwnerTx({
          ownerAddress,
          threshold: 1,
        });
        const txResponse = await safe.executeTransaction(safeTransaction);
        await txResponse.transactionResponse?.wait();
        setOwners(await safe.getOwners());
      } catch (e: any) {
        setError(e);
      } finally {
        setOwnersLoading((ownersLoading) =>
          ownersLoading.filter((address) => address !== ownerAddress)
        );
      }
    },
    [safe]
  );

  return (
    <>
      <Box mt={4}>
        <Heading size="sm">Safe Owners:</Heading>
        <List spacing={3} mt={4}>
          {owners.map((ownerAddress) => (
            <ListItem key={ownerAddress}>
              <ListIcon as={MdTagFaces} color="green.500" />
              <Address address={ownerAddress} />
              <Tooltip label="Remove owner">
                <IconButton
                  isLoading={ownersLoading.includes(ownerAddress)}
                  ml={2}
                  aria-label="Remove owner"
                  size="xs"
                  icon={<MinusIcon />}
                  onClick={() => removeOwner(ownerAddress)}
                />
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Box>
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
      {error && (
        <Alert status="error" mt={4}>
          <AlertIcon />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
    </>
  );
};
