import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Button,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { AiFillGithub } from "react-icons/ai";

import { MenuButtonCopy } from './MenuButtonCopy';
import { MenuButtonDelete } from './MenuButtonDelete';
import { MenuButtonDocs } from './MenuButtonDocs';
import { MenuButtonEdit } from './MenuButtonEdit';
import { MenuButtonMore } from './MenuButtonMore';
import { MenuButtonOptions } from './MenuButtonOptions';
import { OptionsPanel } from './OptionsPanel';

export const MenuMetapage: React.FC = () => {
  const { isOpen, onClose, onToggle } = useDisclosure();

  return (
    <>
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          variant="ghost"
          color="gray.400"
          icon={<HamburgerIcon />}
        />
        <MenuList>
          <MenuButtonOptions onToggle={onToggle} />
          <MenuButtonCopy />
          <MenuButtonEdit />
          <MenuButtonDelete />
          <MenuButtonDocs />
          <MenuButtonMore />
          <Link href={"https://github.com/metapages/metapage-app"} aria-label="github" isExternal={true}>
            <MenuItem icon={<AiFillGithub />}>Source</MenuItem>
          </Link>
        </MenuList>
      </Menu>

      {isOpen ? (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Metapage options</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <OptionsPanel />
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      ) : null}
    </>
  );
};
