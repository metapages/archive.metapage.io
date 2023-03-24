import {
  Box,
  Card,
  CardBody,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";

import { PanelExamples } from "./PanelExamples";
import { PanelFromUrl } from "./PanelFromUrl";
import { PanelDocs } from "./PanelDocs";
import { PanelPasteJson } from "./PanelPasteJson";

export const PanelHelp: React.FC = () => {
  return (
    <VStack align="flex-start" w="100%">

        <Card w="100%">
          <CardBody>
            <Heading size="sm">
              A metapage is a browser application composed of connected
              websites, completely encoded into the URL
            </Heading>
          </CardBody>
        </Card>


      <HStack align="flex-start" w="100%">
        <VStack w="50%" align="flex-start">
          <PanelDocs />
          <PanelExamples />
        </VStack>
        <VStack w="50%" align="flex-start">
            <Box layerStyle={"textHighlightBox"}>
              Two ways to embed a metapage:
            </Box>
          <PanelPasteJson />
          <PanelFromUrl />
        </VStack>
      </HStack>
    </VStack>
  );
};
