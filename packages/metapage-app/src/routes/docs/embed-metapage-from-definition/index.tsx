import React from "react";
import { Box } from "@chakra-ui/react";
import { ExampleEmbedMetapage } from "./ExampleEmbedMetapage";

export const Route: React.FC = () => {
  return (
    <Box bg="white" w="100%" p={4} color="black">
      <ExampleEmbedMetapage />
    </Box>
  );
};
