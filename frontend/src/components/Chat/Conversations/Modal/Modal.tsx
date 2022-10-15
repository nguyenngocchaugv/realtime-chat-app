import { useLazyQuery } from '@apollo/client';
import {
  Button,
  Input,
  Modal, ModalBody, ModalCloseButton,
  ModalContent, ModalHeader, ModalOverlay, Stack
} from '@chakra-ui/react';
import { FC, FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import UserOperations from '../../../../graphql/operations/user';
import { SearchedUser, SearchUsersData, SearchUsersInput } from '../../../../util/types';
import Participants from './Participants';
import UserSearchList from './UserSearchList';


type ConversationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ConversationModal: FC<ConversationModalProps> = ({
  isOpen,
  onClose
}) => {
  const [username, setUsername] = useState("");
  const [participants, setParticipants] = useState<SearchedUser[]>([]);
  const [searchUsers, { data, loading, error }] = useLazyQuery<
    SearchUsersData,
    SearchUsersInput
  >(UserOperations.Queries.searchUsers);

  const onCreateConversation = async () => {
    try {

    } catch (error: any) {
      console.log('onCreateConversation error', error);
      toast.error(error?.message);
    }
  };

  const onSearch = async (e: FormEvent) => {
    e.preventDefault();
    searchUsers({ variables: { username } });
  };

  const addParticipant = (user: SearchedUser) => {
    setParticipants(prev => [...prev, user]);
    setUsername('');
  };

  const removeParticipant = (userId: string) => {
    setParticipants(prev => prev.filter(p => p.id !== userId));
  };


  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="#2d2d2d" pb={4}>
          <ModalHeader>Create a Conversation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={onSearch} noValidate>
              <Stack spacing={4}>
                <Input
                  placeholder="Enter a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Button type="submit" disabled={!username} isLoading={loading}>
                  Search
                </Button>
              </Stack>
            </form>
            {data?.searchUsers &&
              <UserSearchList
                users={data?.searchUsers}
                addParticipant={addParticipant}
              />}
            {participants.length !== 0 && (
              <>
                <Participants
                  participants={participants}
                  removeParticipant={removeParticipant}
                />
                <Button
                  bg="brand.100"
                  width="100%"
                  mt={6}
                  _hover={{ bg: "brand.100" }}
                  onClick={() => { }}
                >
                  Create Conversation
                </Button>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConversationModal;