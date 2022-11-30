import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  InputGroup,
  Input,
  InputLeftAddon,
  Box,
  Alert,
  AlertIcon,
  AlertDescription,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";
import { ethers } from "ethers";
import { useSigner } from "wagmi";
import Safe from "@gnosis.pm/safe-core-sdk";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import { Owners } from "./Owners";
import { NewSafe } from "./NewSafe";
import { SendTransaction } from "./SendTransaction";

export const SafeDashboard: React.FC = () => {
  const { query, push } = useRouter();
  const { safe: safeInfo } = useSafeAppsSDK();
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState<boolean>(false);
  const [safe, setSafe] = useState<Safe>();
  const [threshold, setThreshold] = useState<number>();
  const { data: signer } = useSigner();
  const safeAddress = safeInfo.safeAddress || query?.safeAddress?.toString();

  useEffect(() => {
    (async () => {
      if (signer && safeAddress) {
        setSafe(undefined);
        setError(undefined);
        setLoading(true);
        const ethAdapter = new EthersAdapter({
          ethers,
          signer,
        });
        try {
          const safe = await Safe.create({
            ethAdapter,
            safeAddress,
          });
          setSafe(safe);
          setThreshold(await safe.getThreshold());
          setLoading(false);
        } catch (e: any) {
          setSafe(undefined);
          setThreshold(undefined);
          setError(e);
          setLoading(false);
        }
      } else {
        setSafe(undefined);
        setThreshold(undefined);
        setError(undefined);
        setLoading(false);
      }
    })();
  }, [signer, safeAddress]);

  return (
    <>
      <NewSafe />

      <InputGroup mt={4}>
        <InputLeftAddon>Safe address</InputLeftAddon>
        <Input
          value={safeAddress || ""}
          onChange={(event) =>
            push({
              query: event.target.value
                ? { safeAddress: event.target.value }
                : {},
            })
          }
        />
      </InputGroup>

      {loading && (
        <Spinner
          mt={4}
          thickness="4px"
          speed="0.65s"
          color="green.500"
          size="xl"
        />
      )}

      {error && (
        <Alert mt={4} status="error">
          <AlertIcon />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <Box mt={4}>
        {safe && (
          <Alert status="success">
            <AlertIcon as={MdCheckCircle} color="green.500" />
            <AlertDescription>Gnosis Safe detected!</AlertDescription>
          </Alert>
        )}
      </Box>

      {safe && (
        <>
          <Box mt={4}>
            <Owners safe={safe} />
          </Box>
          <Text mt={4}>Threshold: {threshold}</Text>
          <Box mt={4}>
            <SendTransaction safe={safe} />
          </Box>
        </>
      )}
    </>
  );
};
