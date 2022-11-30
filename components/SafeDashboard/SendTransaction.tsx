import { useState, useCallback } from "react";
import { BigNumber } from "ethers";
import {
  InputGroup,
  InputLeftAddon,
  Input,
  Button,
  Alert,
  AlertIcon,
  AlertDescription,
  Text,
} from "@chakra-ui/react";
import { useBalance } from "wagmi";
import Safe from "@gnosis.pm/safe-core-sdk";

export const SendTransaction: React.FC<{
  safe: Safe;
}> = ({ safe }) => {
  const [toAddress, setToAddress] = useState<string>();
  const [tokenAddress, setTokenAddress] = useState<string>();
  const [amount, setAmount] = useState<BigNumber>();
  const [tokenAmount, setTokenAmount] = useState<BigNumber>();
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState<boolean>(false);
  const { data: safeBalance } = useBalance({
    addressOrName: safe?.getAddress(),
    enabled: !!safe,
  });
  const { data: tokenBalance, error: tokenError } = useBalance({
    addressOrName: safe?.getAddress(),
    token: tokenAddress,
    enabled: !!safe && !!tokenAddress,
  });

  const sendTransaction = useCallback(async () => {
    if (toAddress) {
      try {
        setError(undefined);
        setLoading(true);
        const safeTransaction = await safe.createTransaction({
          safeTransactionData: {
            to: toAddress,
            value: (amount || BigNumber.from(0)).toString(),
            data: "0x",
          },
        });
        const txResponse = await safe.executeTransaction(safeTransaction);
        await txResponse.transactionResponse?.wait();
      } catch (e: any) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }
  }, [toAddress, amount, safe]);

  return safeBalance ? (
    <>
      <Text mt={4}>
        Safe balance: {safeBalance?.formatted} {safeBalance.symbol}
      </Text>
      <InputGroup mt={4}>
        <InputLeftAddon>Destination address</InputLeftAddon>
        <Input
          value={toAddress || ""}
          onChange={(event) => setToAddress(event.target.value)}
        />
      </InputGroup>
      <InputGroup mt={4}>
        <InputLeftAddon>{safeBalance.symbol} amount in wei</InputLeftAddon>
        <Input
          type="number"
          value={amount?.toString() || ""}
          onChange={(event) => {
            try {
              const amount = BigNumber.from(event.target.value);
              setAmount(amount);
            } catch {
              setAmount(undefined);
            }
          }}
        />
      </InputGroup>
      <InputGroup mt={4}>
        <InputLeftAddon>Token address</InputLeftAddon>
        <Input
          value={tokenAddress || ""}
          onChange={(event) => setTokenAddress(event.target.value)}
        />
      </InputGroup>
      {tokenAddress && tokenBalance && (
        <>
          <Text mt={4}>
            Token balance: {tokenBalance?.formatted} {tokenBalance.symbol}
          </Text>
          <InputGroup mt={4}>
            <InputLeftAddon>{tokenBalance.symbol} amount in wei</InputLeftAddon>
            <Input
              type="number"
              value={tokenAmount?.toString() || ""}
              onChange={(event) => {
                try {
                  const tokenAmount = BigNumber.from(event.target.value);
                  setTokenAmount(tokenAmount);
                } catch {
                  setTokenAmount(undefined);
                }
              }}
            />
          </InputGroup>
        </>
      )}
      <Button
        mt={4}
        colorScheme="green"
        isLoading={loading}
        disabled={!toAddress || loading}
        onClick={sendTransaction}
        loadingText={"Send from Safe"}
      >
        Send from Safe
      </Button>
      {(error || tokenError) && (
        <Alert status="error" mt={4}>
          <AlertIcon />
          <AlertDescription>
            {error?.message || tokenError?.message}
          </AlertDescription>
        </Alert>
      )}
    </>
  ) : null;
};
