import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Card,
  CardBody,
  Code,
  Heading,
  Highlight,
  Link,
} from "@chakra-ui/react";
import React from "react";

export const PanelFromUrl: React.FC = () => {
  const exampleUrl = `${window.location.protocol}//${window.location.host}#?url=https://metapages.org/metapages/dynamic-plot/metapage.json`;
  return (
    <Card w="100%">
      <CardBody>
        <Box layerStyle={"textHighlightBox"}>
          2. <Code>#url=?</Code> hash parameter pointing to the location of the
          metapage.json
        </Box>
        Example: <br />
        <Link
          href={exampleUrl}
          aria-label="example-url-embed"
          isExternal={true}
        >
          {`${window.location.protocol}//${window.location.host}`}{" "}
          <Highlight
            query="spotlight"
            styles={{ px: "1", py: "1", bg: "orange.100" }}
          >
            {`#?url=`}
          </Highlight>
          {`https://metapages.org/metapages/dynamic-plot/metapage.json`}
        </Link>
      </CardBody>
    </Card>
  );
};
