import { Badge, Box, HStack, Text, VStack } from "@chakra-ui/react";
import { MetaframeStandaloneComponent } from "@metapages/metapage-grid-react";
import React, { useCallback, useState } from "react";

export const ExampleEmbedMetaframe: React.FC<{
  url: string;
}> = ({ url }) => {
  const [text, setText] = useState("starting text");
  const onOutputs = useCallback(
    (outputs: any) => {
      setText(outputs?.value);
    },
    [setText]
  );

  return (
    <VStack p={10}>
      <Box w="100%" borderWidth="1px" borderRadius="lg" border="blue.500">
        <Text>
          This example shows an editor as an embedded metaframe with outputs handled by react
          hooks
        </Text>
      </Box>

      <HStack align="flex-start" w="100%" m={10} p={10}>
        <Box w="50%" h="90vh">
          <MetaframeStandaloneComponent
            url={url}
            inputs={{ value: "starting text" }}
            onOutputs={onOutputs as any}
            height="100%"
          />
        </Box>
        <VStack w="50%" align="flex-start">
          <Box w="100%" borderWidth="1px" borderRadius="lg" border="blue.500" p={2}>
            <Badge>Text output from the embedded metaframe</Badge>
            <Text minH="40px" border="blue.500" fontSize="md">
              {text}
            </Text>
          </Box>
        </VStack>
      </HStack>
    </VStack>
  );
};
