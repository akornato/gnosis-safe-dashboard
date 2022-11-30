import React from "react";
import type { NextPage } from "next";
import { Heading, Box, HStack, Spacer } from "@chakra-ui/react";
import { ConnectButton } from "../components/ConnectButton";
import { SafeDashboard } from "../components/SafeDashboard";

const Home: NextPage = () => {
  return (
    <Box p={8}>
      <HStack>
        <Heading size="md">Gnosis Safe Dashboard</Heading>
        <Spacer />
        <ConnectButton />
      </HStack>
      <Box mt={4}>
        <SafeDashboard />
      </Box>
    </Box>
  );
};

export default Home;
