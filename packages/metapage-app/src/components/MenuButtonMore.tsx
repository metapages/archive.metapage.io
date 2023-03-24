import { Link, MenuItem } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { METAPAGES_GALLERY } from "./links";

export const MenuButtonMore: React.FC = () => {
  return (
    <Link href={METAPAGES_GALLERY} aria-label="gallery" isExternal={true}>
      <MenuItem icon={<ExternalLinkIcon />}>Examples</MenuItem>
    </Link>
  );
};
