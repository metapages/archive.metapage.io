import { MenuItem } from '@chakra-ui/react';
import { FiSettings } from 'react-icons/fi';

import { metapageDefinitionFromUrl } from '../../hooks/metapageDefinitionFromUrl';
import { MENU_ICON_SIZE } from '../constants';

export const MenuButtonOptions: React.FC<{ onToggle: () => void }> = ({
  onToggle,
}) => {
  const [metapageDefinition] = metapageDefinitionFromUrl();

  return (
    <MenuItem
      isDisabled={!metapageDefinition}
      icon={<FiSettings size={MENU_ICON_SIZE} />}
      onClick={onToggle}
    >
      Options
    </MenuItem>
  );
};
