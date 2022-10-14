import {
  Modal, ModalBody, ModalCloseButton,
  ModalContent, ModalHeader, ModalOverlay, Text
} from '@chakra-ui/react';
import { FC } from 'react';

type ConversationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ConversationModal: FC<ConversationModalProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Modal Body</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConversationModal;