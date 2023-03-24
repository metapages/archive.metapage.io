import { MenuItem } from '@chakra-ui/react';
import { FiSettings } from 'react-icons/fi';

import { metapageDefinitionFromUrl } from '../hooks/metapageDefinitionFromUrl';

export const MenuButtonOptions: React.FC<{ onToggle: () => void }> = ({
  onToggle,
}) => {
  const [metapageDefinition] = metapageDefinitionFromUrl();

  return (
    <MenuItem
      isDisabled={!metapageDefinition}
      icon={<FiSettings />}
      onClick={onToggle}
    >
      Options
    </MenuItem>
  );
};
