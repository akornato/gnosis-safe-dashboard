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

  useEffect(() => {
    safe.getOwners().then(setOwners).catch(console.log);
  }, [safe]);

  const addNewOwner = useCallback(async () => {
    if (safe && newOwnerAddress) {
      const safeTransaction = await safe?.createAddOwnerTx({
        ownerAddress: newOwnerAddress,
      });
      const txResponse = await safe.executeTransaction(safeTransaction);
      await txResponse.transactionResponse?.wait();
      safe.getOwners().then(setOwners).catch(console.log);
    }
  }, [safe, newOwnerAddress]);

  const removeOwner = useCallback(
    async (ownerAddress: string) => {
      if (safe) {
        const safeTransaction = await safe.createRemoveOwnerTx({
          ownerAddress,
          threshold: 1,
        });
        const txResponse = await safe.executeTransaction(safeTransaction);
        await txResponse.transactionResponse?.wait();
        safe.getOwners().then(setOwners).catch(console.log);
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
    </>
  );
};
