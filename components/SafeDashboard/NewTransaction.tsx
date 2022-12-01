import { useState, useCallback } from "react";
import { ethers, BigNumber } from "ethers";
import {
  InputGroup,
  InputLeftAddon,
  Input,
  Button,
  Alert,
  AlertIcon,
  AlertDescription,
  Text,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { useBalance, useAccount } from "wagmi";
import Safe from "@safe-global/safe-core-sdk";
import SafeServiceClient from "@safe-global/safe-service-client";
import type { MetaTransactionData } from "@safe-global/safe-core-sdk-types";

const getTokenTxData = async (
  toAddress: string,
  tokenAddress: string,
  tokenAmount: BigNumber
) => {
  if (tokenAddress && tokenAmount) {
    const token = new ethers.Contract(tokenAddress, [
      "function transfer(address to, uint value) payable",
    ]);
    const unsignedTransaction = await token.populateTransaction.transfer(
      toAddress,
      tokenAmount
    );
    return unsignedTransaction.data || "0x";
  }
  return "0x";
};

const getSafeTransactionData = async (
  toAddress?: string,
  amount?: BigNumber,
  tokenAddress?: string,
  tokenAmount?: BigNumber
) => {
  const data = [];
  if (toAddress && amount) {
    data.push({
      to: toAddress,
      value: amount.toString(),
      data: "0x",
    });
  }
  if (toAddress && tokenAddress && tokenAmount) {
    const txTokenData = await getTokenTxData(
      toAddress,
      tokenAddress,
      tokenAmount
    );
    data.push({
      to: tokenAddress,
      value: "0",
      data: txTokenData,
    });
  }
  return data;
};

export const NewTransaction: React.FC<{
  safe: Safe;
  safeService?: SafeServiceClient;
}> = ({ safe, safeService }) => {
  const { address: connectedAddress } = useAccount();
  const [toAddress, setToAddress] = useState<string>();
  const [tokenAddress, setTokenAddress] = useState<string>();
  const [amount, setAmount] = useState<BigNumber>();
  const [tokenAmount, setTokenAmount] = useState<BigNumber>();
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState<boolean>(false);
  const { data: safeBalance } = useBalance({
    addressOrName: safe?.getAddress(),
    enabled: !!safe,
    watch: true,
  });
  const { data: tokenBalance, error: tokenError } = useBalance({
    addressOrName: safe?.getAddress(),
    token: tokenAddress,
    enabled: !!safe && !!tokenAddress,
    watch: true,
  });

  const proposeTransaction = useCallback(async () => {
    if (toAddress) {
      try {
        setError(undefined);
        setLoading(true);
        const safeTransactionData: MetaTransactionData[] =
          await getSafeTransactionData(
            toAddress,
            amount,
            tokenAddress,
            tokenAmount
          );
        const safeTransaction = await safe.createTransaction({
          safeTransactionData,
        });
        if (connectedAddress && safeService) {
          const safeTxHash = await safe.getTransactionHash(safeTransaction);
          const signature = await safe.signTransactionHash(safeTxHash);
          await safeService.proposeTransaction({
            safeAddress: safe.getAddress(),
            senderAddress: connectedAddress,
            safeTransactionData: safeTransaction.data,
            safeTxHash: safeTxHash,
            senderSignature: signature.data,
          });
          await safeService.confirmTransaction(safeTxHash, signature.data);
        }
      } catch (e: any) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }
  }, [
    toAddress,
    amount,
    tokenAddress,
    tokenAmount,
    safe,
    safeService,
    connectedAddress,
  ]);

  return safeBalance ? (
    <Accordion allowToggle backgroundColor="gray.50">
      <AccordionItem>
        <AccordionButton px={4}>
          <Box flex="1" textAlign="left">
            <Text>New transaction</Text>
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
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
                  setAmount(BigNumber.from(event.target.value));
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
                <InputLeftAddon>
                  {tokenBalance.symbol} amount in wei
                </InputLeftAddon>
                <Input
                  type="number"
                  value={tokenAmount?.toString() || ""}
                  onChange={(event) => {
                    try {
                      setTokenAmount(BigNumber.from(event.target.value));
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
            onClick={proposeTransaction}
            loadingText="Propose"
          >
            Propose
          </Button>
          {(error || tokenError) && (
            <Alert status="error" mt={4}>
              <AlertIcon />
              <AlertDescription>
                {error?.message || tokenError?.message}
              </AlertDescription>
            </Alert>
          )}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  ) : null;
};
