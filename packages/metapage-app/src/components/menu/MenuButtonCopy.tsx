import { MenuItem, useClipboard, useToast } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { AiOutlineCopy } from 'react-icons/ai';

import { metapageDefinitionFromUrl } from '../../hooks/metapageDefinitionFromUrl';
import { MENU_ICON_SIZE } from '../constants';

export const MenuButtonCopy: React.FC = () => {
  const [metapageDefinition] = metapageDefinitionFromUrl();
  const [toCopy, setToCopy] = useState<string>("");
  const { setValue, onCopy } = useClipboard(toCopy);
  const toast = useToast();

  useEffect(() => {
    setToCopy(
      metapageDefinition ? JSON.stringify(metapageDefinition, null, "  ") : ""
    );
  }, [metapageDefinition]);

  const onclick = useCallback(() => {
    if (metapageDefinition) {
      setValue(toCopy);
      onCopy();
      toast({
        title: "Copied!",
        position: "top",
        // description: "JSON metapage copied",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  }, [toCopy, setValue, onCopy, toast]);

  return (
    <MenuItem
      isDisabled={!metapageDefinition}
      onClick={onclick}
      icon={<AiOutlineCopy size={MENU_ICON_SIZE}/>}
    >
      Copy
    </MenuItem>
  );
};
