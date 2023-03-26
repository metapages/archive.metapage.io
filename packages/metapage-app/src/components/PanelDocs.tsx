import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Card,
  CardBody,
  Heading,
  Link,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";
import React from "react";

import { EXTERNAL_DOCS } from "./constants";

export const PanelDocs: React.FC = () => {
  return (
    <Card w="100%">
      <CardBody>
        <Box layerStyle={"textHighlightBox"}>
          <Heading size="md">
            <Link href={EXTERNAL_DOCS} aria-label="docs" isExternal={true}>
              <ExternalLinkIcon /> Documentation
            </Link>
          </Heading>
        </Box>

        <br />

        <UnorderedList>
          <ListItem>
            Build faster and better: embed metapages into your own site
          </ListItem>
          <ListItem>
            Share complexity and creativity: create, and share apps, dashboards,
            and workflows
          </ListItem>
          <ListItem>
            Connect your API or website to others: embed your websites in other
            metapages
          </ListItem>
          <ListItem>
            Efficient updates: modify a component of your app with a simple URL
            change
          </ListItem>
        </UnorderedList>
      </CardBody>
    </Card>
  );
};
