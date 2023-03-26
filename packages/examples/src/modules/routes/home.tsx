import { Box, Tab, TabList, TabPanel, TabPanels, Tabs, Text, VStack } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { ExampleEmbedMetaframe } from './embed-metaframe/ExampleEmbedMetaframe';
import { ExampleEmbedMetapage } from './embed-metapage-from-definition/ExampleEmbedMetapage';
import { ExampleEmbedMetapageFromObject } from './embed-metapage-from-object/ExampleEmbedMetapageFromObject';

export const Route: React.FC = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  const [index, setIndex] = useState(0);
  // searchParams -> index
  useEffect(() => {
    if (searchParams.get("tab")) {
      setIndex(parseInt(searchParams.get("tab") || "0"));
    }
  }, [searchParams, setIndex]);

  // tab change -> searchParams
  const onChange = useCallback(
    (index: number) => {
      setSearchParams({ tab: index.toString() });
    },
    [setSearchParams]
  );

  return (
    <VStack p={10} w="100%" align="flex-start">
      <Box w="100%">
        <Text>Linked examples of embedding metapages and metaframes:</Text>
      </Box>

      <Box w="100%" borderWidth="1px" borderRadius="lg" border="blue.500" p={2}>
        <Tabs
          orientation="vertical"
          variant="soft-rounded"
          index={index}
          onChange={onChange}
        >
          <TabList>
            <Tab>embed metaframe</Tab>
            <Tab>embed metapage from definition</Tab>
            <Tab>embed metapage from object</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <ExampleEmbedMetaframe url="https://editor.mtfm.io/#?options=eyJhdXRvc2VuZCI6dHJ1ZSwiaGlkZW1lbnVpZmlmcmFtZSI6ZmFsc2UsIm1vZGUiOiJqYXZhc2NyaXB0IiwidGhlbWUiOiJ2cy1kYXJrIn0=" />
            </TabPanel>
            <TabPanel>
              <ExampleEmbedMetapage />
            </TabPanel>
            <TabPanel>
              <ExampleEmbedMetapageFromObject />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </VStack>
  );
};
