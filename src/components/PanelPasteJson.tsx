import React, {
  useCallback,
  useState,
} from 'react';

import {
  Box,
  Button,
  Spinner,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { MetaframeInputMap } from '@metapages/metapage';

import { metapageDefinitionFromUrl } from '../hooks/metapageDefinitionFromUrl';
import {
  usePasteMetapageDefinition,
} from '../hooks/usePasteMetapageDefinition';
import {
  MetaframeStandaloneComponent,
} from '../lib/components/MetaframeStandaloneComponent';

// change this if developing locally the root site to the demo metapages
const METAPAGES_ORG = "https://metapages.org/";

export const PanelPasteJson: React.FC = () => {

  // this panel allows pasting in new metapage JSON
  usePasteMetapageDefinition();
  const [metapageDefinition, setMetapageDefinition] =
    metapageDefinitionFromUrl();

  const toast = useToast();

  const [metapageJsonInEditor, setMetapageJsonInEditor] =
    useState<any>(exampleJson);

  const onOutputs = useCallback(
    (outputs: MetaframeInputMap) => {
      if (outputs["text"] === undefined || outputs["text"] === null) {
        return;
      }
      setMetapageJsonInEditor(outputs["text"]);
    },
    [setMetapageJsonInEditor]
  );

  const onClick = useCallback(() => {
    try {
      setMetapageDefinition(metapageJsonInEditor);
    } catch (err) {
      toast({
        title: "Error parsing JSON",
        position: "top",
        description: `${err}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }, [metapageJsonInEditor, useToast]);

  return (
    <VStack w="100%" align="flex-start">
      <Box>
        Paste metapage JSON from the clipboard and this page will show the
        metapage
      </Box>

      <Button colorScheme="blue" variant="outline" onClick={onClick}>
        Load and show metapage
      </Button>

      <Box w="100%" h="80vh">
        {metapageDefinition ? (
          <Spinner />
        ) : (
          <MetaframeStandaloneComponent
            url="https://editor.mtfm.io/#?hm=disabled&options=JTdCJTIyYXV0b3NlbmQlMjIlM0F0cnVlJTJDJTIybW9kZSUyMiUzQSUyMmpzb24lMjIlMkMlMjJzYXZlbG9hZGluaGFzaCUyMiUzQWZhbHNlJTJDJTIydGhlbWUlMjIlM0ElMjJsaWdodCUyMiU3RA=="
            inputs={{ text: metapageJsonInEditor }}
            onOutputs={onOutputs}
            style={{height:"80vh"}}
          />
        )}
      </Box>
    </VStack>
  );
};

const exampleJson = JSON.stringify(
  {
    version: "0.3",
    meta: {
      layouts: {
        "react-grid-layout": {
          docs: "https://www.npmjs.com/package/react-grid-layout",
          layout: [
            {
              h: 3,
              i: "graph-dynamic",
              moved: false,
              static: false,
              w: 6,
              x: 0,
              y: 0,
            },
            {
              h: 3,
              i: "random-data-generator",
              moved: false,
              static: false,
              w: 6,
              x: 6,
              y: 0,
            },
          ],
          props: {
            cols: 12,
            containerPadding: [5, 5],
            margin: [10, 20],
            rowHeight: 100,
          },
        },
      },
    },
    metaframes: {
      "random-data-generator": {
        url: `${METAPAGES_ORG}metaframes/random-data-generator/?frequency=1000`,
      },
      "graph-dynamic": {
        url: `${METAPAGES_ORG}metaframes/graph-dynamic/`,
        inputs: [
          {
            metaframe: "random-data-generator",
            source: "y",
          },
        ],
      },
    },
    plugins: [
      "https://mermaid.mtfm.io/#?hm=disabled",
      "https://editor.mtfm.io/#?hm=disabled&options=JTdCJTIybW9kZSUyMiUzQSUyMmpzb24lMjIlMkMlMjJzYXZlbG9hZGluaGFzaCUyMiUzQWZhbHNlJTJDJTIydGhlbWUlMjIlM0ElMjJsaWdodCUyMiU3RA==",
    ],
  },
  null,
  "  "
);

const urlExampleMetapageJsonAsHash =
  typeof window !== "undefined"
    ? `${window.location.origin}/#?url=${METAPAGES_ORG}metapages/dynamic-plot/metapage.json`
    : undefined;
