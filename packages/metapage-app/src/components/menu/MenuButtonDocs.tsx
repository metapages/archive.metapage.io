import { Link, MenuItem } from '@chakra-ui/react';
import { IoMdHelpCircle } from 'react-icons/io';
import { Link as RouterLink } from 'react-router-dom';

import { MENU_ICON_SIZE } from '../constants';

export const MenuButtonDocs: React.FC = () => {
  return (
    <Link as={RouterLink} to="./docs" aria-label="docs">
      <MenuItem icon={<IoMdHelpCircle size={MENU_ICON_SIZE} />}>Documentation</MenuItem>
    </Link>
  );
};
