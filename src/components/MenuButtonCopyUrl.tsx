import { CopyIcon } from '@chakra-ui/icons';
import {
  MenuItem,
  useClipboard,
  useToast,
} from '@chakra-ui/react';

export const MenuButtonCopyUrl: React.FC = () => {
  const toast = useToast();
  const { onCopy } = useClipboard(window.location.href);
    
  return (
    <MenuItem
      
      onClick={() => {
        onCopy();
        toast({
          title: "Copied URL to clipboard",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }}
      icon={<CopyIcon />}
    >
      Copy URL
    </MenuItem>
  );
};
