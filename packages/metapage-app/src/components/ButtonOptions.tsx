import { IconButton } from "@chakra-ui/react";
import { FiSettings } from "react-icons/fi";

import { metapageDefinitionFromUrl } from "../hooks/metapageDefinitionFromUrl";
import { MENU_ICON_SIZE } from "./constants";

export const ButtonOptions: React.FC<{ onToggle: () => void }> = ({
  onToggle,
}) => {
  const [metapageDefinition] = metapageDefinitionFromUrl();

  return (
    <IconButton
      aria-label="options"
      isDisabled={!metapageDefinition}
      icon={<FiSettings size={MENU_ICON_SIZE} />}
      onClick={onToggle}
    >
      Options
    </IconButton>
  );
};
