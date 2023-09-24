import React from 'react';

import {
  Box,
  Card,
  CardBody,
  HStack,
} from '@chakra-ui/react';

import { PanelPasteJson } from './PanelPasteJson';

export const PanelHelp: React.FC = () => {
  return (
    <HStack align="space-evenly" w="100%">
      <Card w="100%">
        <CardBody>
          <PanelPasteJson />
        </CardBody>
      </Card>
      <Box className="iframe-container"  w="100%">
        <iframe
          className="iframe"
          // In this case only, we are used to display our own help
          src={`https://markdown.mtfm.io/#?hm=disabled&url=${window.location.origin}${window.location.pathname}/README.md`}
        />
      </Box>

    </HStack>
  );
};
