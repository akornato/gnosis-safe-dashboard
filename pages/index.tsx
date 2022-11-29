import React from "react";
import type { NextPage } from "next";
import { Heading, Box } from "@chakra-ui/react";
import { ConnectButton } from "../components/ConnectButton";
import { SafeDashboard } from "../components/SafeDashboard";

const Home: NextPage = () => {
  return (
    <Box p={6}>
      <Box>
        <Heading size="md">Gnosis Safe Dashboard</Heading>
      </Box>
      <Box mt={4}>
        <ConnectButton />
      </Box>
      <Box mt={4}>
        <SafeDashboard />
      </Box>
    </Box>
  );
};

export default Home;
