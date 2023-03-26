import { Link, MenuItem } from "@chakra-ui/react";
import { AiOutlineSearch } from "react-icons/ai";

import { METAPAGES_GALLERY, MENU_ICON_SIZE } from "../constants";

export const MenuButtonGallery: React.FC = () => {
  return (
    <Link href={METAPAGES_GALLERY} aria-label="search">
      <MenuItem icon={<AiOutlineSearch size={MENU_ICON_SIZE} />}>
        Gallery
      </MenuItem>
    </Link>
  );
};
