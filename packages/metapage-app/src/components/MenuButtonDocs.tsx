import { Link, MenuItem } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { EXTERNAL_DOCS } from "./links";

export const MenuButtonDocs: React.FC = () => {
  return (
    <Link href={EXTERNAL_DOCS} aria-label="docs" isExternal={true}>
      <MenuItem icon={<ExternalLinkIcon />}>Documentation</MenuItem>
    </Link>
  );
};
