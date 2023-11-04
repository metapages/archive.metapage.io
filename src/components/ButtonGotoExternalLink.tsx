import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  IconButton,
  Link,
} from '@chakra-ui/react';

export const ButtonGotoExternalLink: React.FC = () => {
  return (
    <Link _hover={undefined} href={window.location.href} isExternal>
      <IconButton
        variant="ghost"
        color="gray.400"
        aria-label="go to source url"
        icon={<ExternalLinkIcon />}
      />
    </Link>
  );
};
