import { useState, useCallback } from "react";
import { ethers } from "ethers";
import {
  Box,
  InputGroup,
  Input,
  InputLeftAddon,
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Heading,
} from "@chakra-ui/react";
import { useSigner } from "wagmi";
import Safe, { SafeFactory, SafeAccountConfig } from "@gnosis.pm/safe-core-sdk";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";

export const NewSafe: React.FC<{
  setSafeAddress: (address: string) => void;
}> = ({ setSafeAddress }) => {
  const [owners, setOwners] = useState<string>();
  const [threshold, setThreshold] = useState<number>();
  const { data: signer } = useSigner();
  const [loading, setLoading] = useState<boolean>(false);

  const create = useCallback(async () => {
    if (signer && owners && threshold) {
      setLoading(true);
      const ethAdapter = new EthersAdapter({
        ethers,
        signer,
      });
      const safeFactory = await SafeFactory.create({ ethAdapter });
      const safeAccountConfig: SafeAccountConfig = {
        owners: owners
          ?.split(",")
          .map((address) => address.trim())
          .filter(Boolean),
        threshold,
      };
      const safeSdk: Safe = await safeFactory.deploySafe({ safeAccountConfig });
      setSafeAddress(safeSdk.getAddress());
      setLoading(false);
    }
  }, [signer, owners, threshold, setSafeAddress]);

  return (
    <Accordion allowToggle backgroundColor="gray.50">
      <AccordionItem>
        <AccordionButton px={4}>
          <Box flex="1" textAlign="left">
            <Heading size="sm">New safe</Heading>
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <InputGroup mt={2}>
            <InputLeftAddon>Owners (comma delimited)</InputLeftAddon>
            <Input
              value={owners || ""}
              onChange={(event) => setOwners(event.target.value)}
            />
          </InputGroup>
          <InputGroup mt={4}>
            <InputLeftAddon>Threshold</InputLeftAddon>
            <Input
              value={threshold || ""}
              type="number"
              onChange={(event) => setThreshold(parseInt(event.target.value))}
            />
          </InputGroup>
          <Button
            mt={4}
            colorScheme="blue"
            onClick={create}
            isLoading={loading}
          >
            Create
          </Button>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
