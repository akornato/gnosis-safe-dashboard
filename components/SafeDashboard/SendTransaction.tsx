import { useState, useCallback } from "react";
import { BigNumber } from "ethers";
import {
  Input,
  Button,
  Alert,
  AlertIcon,
  AlertDescription,
  Wrap,
} from "@chakra-ui/react";
import Safe from "@gnosis.pm/safe-core-sdk";

export const SendTransaction: React.FC<{
  safe: Safe;
}> = ({ safe }) => {
  const [address, setAddress] = useState<string>("");
  const [amount, setAmount] = useState<BigNumber>();
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState<boolean>(false);

  const sendTransaction = useCallback(async () => {
    if (address) {
      try {
        setError(undefined);
        setLoading(true);
        const safeTransaction = await safe.createTransaction({
          safeTransactionData: {
            to: address,
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
  }, [address, amount, safe]);

  return (
    <>
      <Wrap direction="row" spacing={2}>
        <Input
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="To address (or ENS)"
          width="auto"
        />
        <Input
          type="number"
          value={amount?.toString()}
          onChange={(event) => {
            try {
              const amount = BigNumber.from(event.target.value);
              setAmount(amount);
            } catch {
              setAmount(undefined);
            }
          }}
          placeholder="Amount (in Wei)"
          width="auto"
        />
        <Button
          isLoading={loading}
          disabled={!address || loading}
          onClick={sendTransaction}
          loadingText={"Send from Safe"}
        >
          Send from Safe
        </Button>
      </Wrap>
      {error && (
        <Alert status="error" mt={4}>
          <AlertIcon />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
    </>
  );
};
