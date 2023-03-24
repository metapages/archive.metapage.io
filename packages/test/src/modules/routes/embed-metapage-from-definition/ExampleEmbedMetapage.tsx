import React, { useCallback, useState } from "react";
import { MetapageGridLayoutFromDefinition } from "@metapages/metapage-grid-react";
import { MetapageDefinitionV3, MetapageEventDefinition, VersionsMetapage } from "@metapages/metapage";
import { Box, Tag, Alert, AlertIcon, AlertDescription } from "@chakra-ui/react";

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

const CustomGridItemComponent = React.forwardRef((props: any, ref) => {
  return (
    <Box
      style={{ overflow: "hidden", ...props.style }}
      borderWidth="1px"
      className={props.className}
      ref={ref as any}
    >
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

export const ExampleEmbedMetapage: React.FC = () => {


  const [definition, setDefinition] = useState<MetapageDefinitionV3>(exampleDefinition);
  const onOutputs = (outputs: any) => {
    // console.log(`Got outputs!! outputs=${JSON.stringify(outputs)}`);
    console.log(`Got outputs!! outputs=${outputs}`);
  };


  const onDefinition = useCallback((def: MetapageDefinitionV3) => {
    setDefinition(def);
  }, [setDefinition]);


  return (
    <div>
      <MetapageGridLayoutFromDefinition
        definition={definition}
        onOutputs={onOutputs as any}
        onDefinition={onDefinition}
        Wrapper={CustomGridItemComponentLabel}
        ErrorWrapper={CustomErrorDisplay}
      />
    </div>
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
