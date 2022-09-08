import { useState } from "react";
import { BigNumber } from "ethers";
import {
  Input,
  Button,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import { useSendTransaction } from "wagmi";

export const Transaction: React.FC = () => {
  const [address, setAddress] = useState<string>();
  const [amount, setAmount] = useState<BigNumber>();
  const { sendTransaction, error } = useSendTransaction({
    request: {
      to: address,
      value: amount,
    },
  });
  return (
    <>
      <Input
        value={address}
        onChange={(event) => setAddress(event.target.value)}
        placeholder="Tx address (or ENS)"
        mr={4}
        mb={4}
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
        placeholder="Tx amount (in Wei)"
        mr={4}
        mb={4}
        width="auto"
      />
      <Button onClick={() => sendTransaction()}>Send transaction</Button>
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
    </>
  );
};
