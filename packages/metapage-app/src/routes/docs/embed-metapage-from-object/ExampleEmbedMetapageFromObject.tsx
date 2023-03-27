import React, { useEffect, useState } from "react";
import { MetapageGridLayoutFromMetapage } from "@metapages/metapage-grid-react";
import {
  Metapage,
  MetapageDefinitionV3,
  VersionsMetapage,
} from "@metapages/metapage";
import {
  Box,
  Tag,
  Alert,
  AlertIcon,
  AlertDescription,
  Text,
  VStack,
  Code,
} from "@chakra-ui/react";

const CustomGridItemComponentLabel = React.forwardRef((props: any, ref) => {
  return (
    <Box
      style={{ overflow: "hidden", textAlign: "left", ...props.style }}
      borderWidth="1px"
      className={props.className}
      ref={ref as any}
    >
      <Tag>{props.children[0].key}</Tag>
      {props.children}
    </Box>
  );
});

const CustomErrorDisplay: React.FC<{ error: any }> = ({ error }) => {
  return (
    <Alert status="error">
      <AlertIcon />
      <AlertDescription>{`${error}`}</AlertDescription>
    </Alert>
  );
};

export const ExampleEmbedMetapageFromObject: React.FC = () => {
  const [metapage, setMetapage] = useState<Metapage | undefined>();
  const onOutputs = (outputs: any) => {
    // console.log(`Got outputs!! outputs=${outputs}`);
  };

  useEffect(() => {
    const newMetapage = Metapage.from(exampleDefinition);
    setMetapage(newMetapage);
    return () => {
      newMetapage.dispose();
    };
  }, []);

  return (
    <VStack p={10} w="100%">
      <Box w="100%">
        <Text>
          This example shows an embedded metapage in a react app, where the
          metapage object is passed into the{" "}
          <Code>MetapageGridLayoutFromMetapage</Code> component
        </Text>
      </Box>

      <Box w="100%" borderWidth="1px" borderRadius="lg" border="blue.500" p={2}>
        <MetapageGridLayoutFromMetapage
          metapage={metapage}
          onOutputs={onOutputs as any}
          Wrapper={CustomGridItemComponentLabel}
          ErrorWrapper={CustomErrorDisplay}
        />
      </Box>
    </VStack>
  );
};

const exampleDefinition: MetapageDefinitionV3 = {
  version: VersionsMetapage.V0_3,
  meta: {
    layouts: {
      flexboxgrid: {
        docs: "http://flexboxgrid.com/",
        layout: [
          [
            {
              name: "random-data-generator",
              width: "col-xs-4",
              style: {
                maxHeight: "600px",
              },
            },
            {
              url: "https://metapages.org/metaframes/passthrough-arrow/?rotation=90",
              width: "col-xs-1",
            },
            {
              name: "graph-dynamic",
              width: "col-xs-7",
            },
          ],
        ],
      },
      "react-grid-layout": {
        docs: "https://www.npmjs.com/package/react-grid-layout",
        props: {
          cols: 12,
          margin: [10, 20],
          rowHeight: 100,
          containerPadding: [5, 5],
        },
        layout: [
          { i: "random-data-generator", x: 0, y: 0, w: 6, h: 2 },
          { i: "graph-dynamic", x: 6, y: 0, w: 6, h: 4 },
          { i: "editor", x: 0, y: 1, w: 6, h: 2 },
        ],
      },
    },
  },
  metaframes: {
    "random-data-generator": {
      url: "https://metapages.org/metaframes/random-data-generator/?frequency=1000",
    },
    "graph-dynamic": {
      url: "https://metapages.org/metaframes/graph-dynamic/",
      inputs: [
        {
          metaframe: "random-data-generator",
          source: "y",
          target: "y",
        },
      ],
    },
    editor: {
      url: "https://editor.mtfm.io/",
      inputs: [
        {
          metaframe: "random-data-generator",
          source: "y",
          target: "value",
        },
      ],
    },
  },
  plugins: [
    "https://metapages.org/metaframes/mermaid.js/?TITLE=0",
    "https://editor.mtfm.io/",
  ],
};
