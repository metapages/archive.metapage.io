import { CopyIcon, EditIcon } from "@chakra-ui/icons";
import { MenuItem, useClipboard, useToast } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { metapageDefinitionFromUrl } from "../hooks/metapageDefinitionFromUrl";

export const MenuButtonEdit: React.FC = () => {
  const [metapageDefinition] = metapageDefinitionFromUrl();
  const [copied, setCopied] = useState<string>("");
  useClipboard(copied);
  const toast = useToast();

  const onclick = useCallback(() => {
    if (metapageDefinition) {
      setCopied(JSON.stringify(metapageDefinition, null, "  "));
      toast({
        title: "Copied!",
        position: "top",
        // description: "JSON metapage copied",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  }, [metapageDefinition, setCopied]);

  return (
    <MenuItem
      // isDisabled={!metapageDefinition}
      isDisabled={true}
      onClick={onclick}
      icon={<EditIcon />}
    >
      (Coming Soon!) Edit at https://app.metapage.io
    </MenuItem>
  );
};
