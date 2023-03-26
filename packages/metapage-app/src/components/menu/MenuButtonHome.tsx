import { Link, MenuItem } from '@chakra-ui/react';
import { useCallback } from 'react';
import { AiFillHome } from 'react-icons/ai';

import { metapageDefinitionFromUrl } from '../../hooks/metapageDefinitionFromUrl';
import { MENU_ICON_SIZE } from '../constants';

export const MenuButtonHome: React.FC = () => {
  const [metapageDefinition] = metapageDefinitionFromUrl();

  const onclick = useCallback(() => {
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    window.location.href = url.href;
  }, [metapageDefinition]);

  return (

    <Link href="/" aria-label="home" >
      <MenuItem icon={<AiFillHome size={MENU_ICON_SIZE}/>}>Home</MenuItem>
    </Link>


    // <Link to="/" aria-label="home">
    //         <MenuItem icon={<AiFillGithub />}>Source</MenuItem>
    //       </Link>


  );
};

// <MenuItem
// // isDisabled={!metapageDefinition}
// icon={<AiFillHome />}
// onClick={onclick}
// >
// Home
// </MenuItem>
