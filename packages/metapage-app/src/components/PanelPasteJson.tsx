import { Box, Button, Card, CardBody, Spinner, useToast } from '@chakra-ui/react';
import { MetaframeInputMap } from '@metapages/metapage';
import React, { useCallback, useState } from 'react';

import { metapageDefinitionFromUrl } from '../hooks/metapageDefinitionFromUrl';
import { usePasteMetapageDefinition } from '../hooks/usePasteMetapageDefinition';
import { MetaframeStandaloneComponent } from "@metapages/metapage-grid-react";

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
      if (outputs["value"] === undefined || outputs["value"] === null) {
        return;
      }
      setMetapageJsonInEditor(outputs["value"]);
    },
    [setMetapageJsonInEditor]
  );

  const onClick = useCallback(() => {
    try {
      console.log(`type ${typeof metapageJsonInEditor}`);
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
    <Card w="100%">
      <CardBody>
        <Box layerStyle={"textHighlightBox"}>
          1. Paste metapage JSON from the clipboard and this page will show the
          metapage
        </Box>

        <Box w="100%" h="500px">
          {metapageDefinition ? (
            <Spinner />
          ) : (
            <MetaframeStandaloneComponent
              url="https://editor.mtfm.io/#?options=eyJhdXRvc2VuZCI6dHJ1ZSwiaGlkZW1lbnVpZmlmcmFtZSI6dHJ1ZSwibW9kZSI6Impzb24iLCJ0aGVtZSI6ImxpZ2h0In0="
              inputs={{ value: metapageJsonInEditor }}
              onOutputs={onOutputs}
              height="500px"
            />
          )}
        </Box>

        <Button colorScheme="blue" onClick={onClick}>
          Load
        </Button>
      </CardBody>
    </Card>
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
      "https://metapages.org/metaframes/mermaid.js/?TITLE=0",
      "https://editor.mtfm.io/#?options=eyJtb2RlIjoianNvbiIsInNhdmVsb2FkaW5oYXNoIjpmYWxzZSwidGhlbWUiOiJ2cy1kYXJrIn0=",
    ],
  },
  null,
  "  "
);

const urlExampleMetapageJsonAsHash =
  typeof window !== "undefined"
    ? `${window.location.origin}/#?url=${METAPAGES_ORG}metapages/dynamic-plot/metapage.json`
    : undefined;
