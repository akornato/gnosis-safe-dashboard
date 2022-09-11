import { useConnect, useDisconnect, useAccount } from "wagmi";

import {
  Alert,
  AlertIcon,
  AlertDescription,
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

export const ConnectorsModal: React.FC = () => {
  const { connector: activeConnector } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen}>Connectors</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Connectors</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {connectors
              .filter((connector) => connector.ready)
              .map((connector) => (
                <Box key={connector.id} mb={2}>
                  <Button
                    onClick={() =>
                      connector.id !== activeConnector?.id
                        ? connect({ connector })
                        : disconnect()
                    }
                  >
                    {(connector.id === activeConnector?.id
                      ? "Disconnect from "
                      : "") + connector.name}
                    {isLoading &&
                      connector.id === pendingConnector?.id &&
                      " (connecting)"}
                  </Button>
                </Box>
              ))}
            {error && (
              <Alert status="error">
                <AlertIcon />
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
