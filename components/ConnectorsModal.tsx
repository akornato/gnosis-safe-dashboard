import { useConnect, useDisconnect } from "wagmi";

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
  const {
    activeConnector,
    connect,
    connectors,
    error,
    isConnecting,
    pendingConnector,
  } = useConnect();
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
              .filter((x) => x.ready)
              .map((x) => (
                <Box key={x.id} mb={2}>
                  <Button
                    onClick={() =>
                      x.id !== activeConnector?.id ? connect(x) : disconnect()
                    }
                  >
                    {(x.id === activeConnector?.id ? "Disconnect from " : "") +
                      x.name}
                    {isConnecting &&
                      x.id === pendingConnector?.id &&
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
