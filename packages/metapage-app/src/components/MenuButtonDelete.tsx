import { MenuItem } from "@chakra-ui/react";
import { useCallback } from "react";
import { metapageDefinitionFromUrl } from "../hooks/metapageDefinitionFromUrl";
import { MdDeleteForever } from "react-icons/md";

export const MenuButtonDelete: React.FC = () => {
  const [metapageDefinition] = metapageDefinitionFromUrl();

  const onclick = useCallback(() => {
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    window.location.href = url.href;
  }, [metapageDefinition]);

  return (
    <MenuItem
      isDisabled={!metapageDefinition}
      icon={<MdDeleteForever />}
      onClick={onclick}
    >
      Clear current metapage (show instructions)
    </MenuItem>
  );
};
