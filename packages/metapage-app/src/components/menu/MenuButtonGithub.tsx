import { Link, MenuItem } from "@chakra-ui/react";
import { AiFillGithub } from "react-icons/ai";

import { MENU_ICON_SIZE } from "../constants";

export const MenuButtonGithub: React.FC = () => {
  return (
    <Link
      href={"https://github.com/metapages/metapage-app"}
      aria-label="github"
    >
      <MenuItem icon={<AiFillGithub size={MENU_ICON_SIZE} />}>Source</MenuItem>
    </Link>
  );
};
