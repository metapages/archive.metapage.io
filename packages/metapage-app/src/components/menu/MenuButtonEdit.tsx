import { MenuItem, useClipboard, useToast } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';

import { metapageDefinitionFromUrl } from '../../hooks/metapageDefinitionFromUrl';
import { MENU_ICON_SIZE } from '../constants';

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
      icon={<AiOutlineEdit size={MENU_ICON_SIZE} />}
    >
      (Coming Soon!) Edit
    </MenuItem>
  );
};
