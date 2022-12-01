import { useEffect, useState, useCallback } from "react";
import Safe from "@safe-global/safe-core-sdk";
import { useEnsName } from "wagmi";
import {
  ButtonGroup,
  IconButton,
  Text,
  Input,
  Box,
  Icon,
  Alert,
  AlertIcon,
  AlertDescription,
  Flex,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { MdTagFaces } from "react-icons/md";

const Address: React.FC<{ address: string }> = ({ address }) => {
  const ensName = useEnsName({
    address,
  });
  return <>{address + (ensName.data ? ` (${ensName.data})` : "")}</>;
};

export const Owners: React.FC<{
  safe: Safe;
}> = ({ safe }) => {
  const [owners, setOwners] = useState<string[]>([]);
  const [newOwnerAddress, setNewOwnerAddress] = useState<string>();
  const [error, setError] = useState<Error>();
  const [removeOwnersLoading, setRemoveOwnersLoading] = useState<string[]>([]);
  const [addOwnerLoading, setAddOwnerLoading] = useState<boolean>(false);

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
        setAddOwnerLoading(true);
        const safeTransaction = await safe?.createAddOwnerTx({
          ownerAddress: newOwnerAddress,
        });
        const txResponse = await safe.executeTransaction(safeTransaction);
        await txResponse.transactionResponse?.wait();
        setOwners(await safe.getOwners());
      } catch (e: any) {
        setError(e);
      } finally {
        setAddOwnerLoading(false);
      }
    }
  }, [safe, newOwnerAddress]);

  const removeOwner = useCallback(
    async (ownerAddress: string) => {
      try {
        setError(undefined);
        setRemoveOwnersLoading((owners) => [...owners, ownerAddress]);
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
        setRemoveOwnersLoading((owners) =>
          owners.filter((address) => address !== ownerAddress)
        );
      }
    },
    [safe]
  );

  return (
    <>
      <Box mt={4}>
        <Text>Owners:</Text>
        {owners.map((ownerAddress) => (
          <Flex key={ownerAddress} mt={4} alignItems="center">
            <Icon boxSize={6} as={MdTagFaces} color="green.500" mr={2} />
            <Address address={ownerAddress} />
            <IconButton
              size="xs"
              colorScheme="green"
              isLoading={removeOwnersLoading.includes(ownerAddress)}
              ml={2}
              aria-label="Remove owner"
              icon={<MinusIcon />}
              onClick={() => removeOwner(ownerAddress)}
            />
          </Flex>
        ))}
      </Box>
      <ButtonGroup mt={4} variant="outline">
        <Input
          placeholder="New owner"
          onChange={(event) => setNewOwnerAddress(event.target.value)}
        />
        <IconButton
          colorScheme="green"
          aria-label="Add new owner"
          isLoading={addOwnerLoading}
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
