import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Button,
  IconButton,
  Menu,
  MenuButton,
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

import { OptionsPanel } from '../OptionsPanel';
import { MenuButtonCopy } from './MenuButtonCopy';
import { MenuButtonHome } from './MenuButtonHome';
import { MenuButtonDocs } from './MenuButtonDocs';
import { MenuButtonEdit } from './MenuButtonEdit';
import { MenuButtonGallery } from './MenuButtonGallery';
import { MenuButtonGithub } from './MenuButtonGithub';
import { MenuButtonOptions } from './MenuButtonOptions';

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
          <MenuButtonHome />
          <MenuButtonOptions onToggle={onToggle} />
          <MenuButtonCopy />
          <MenuButtonEdit />
          <MenuButtonDocs />
          <MenuButtonGallery />
          <MenuButtonGithub />
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
