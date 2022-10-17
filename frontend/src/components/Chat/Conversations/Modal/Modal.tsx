import { useLazyQuery, useMutation } from '@apollo/client';
import {
  Button,
  Input,
  Modal, ModalBody, ModalCloseButton,
  ModalContent, ModalHeader, ModalOverlay, Stack
} from '@chakra-ui/react';
import { Session } from 'next-auth';
import { FC, FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import ConversationOperations from '../../../../graphql/operations/conversation';
import UserOperations from '../../../../graphql/operations/user';
import {
  CreateConversationData,
  CreateConversationInput, SearchedUser,
  SearchUsersData,
  SearchUsersInput
} from '../../../../util/types';
import Participants from './Participants';
import UserSearchList from './UserSearchList';


type ConversationModalProps = {
  session: Session;
  isOpen: boolean;
  onClose: () => void;
};

const ConversationModal: FC<ConversationModalProps> = ({
  session,
  isOpen,
  onClose,
}) => {
  const { user: { id } } = session;
  const [username, setUsername] = useState("");
  const [participants, setParticipants] = useState<SearchedUser[]>([]);
  const [searchUsers, { data, loading, error }] = useLazyQuery<
    SearchUsersData,
    SearchUsersInput
  >(UserOperations.Queries.searchUsers);

  const [createConversation, { loading: createConversationLoading }] = useMutation<
    CreateConversationData,
    CreateConversationInput
  >(ConversationOperations.Mutations.createConversation);

  const onCreateConversation = async () => {
    const participantIds = [id, ...participants.map(p => p.id)];
    try {
      const { data } = await createConversation({
        variables: {
          participantIds,
        }
      });
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
                  isLoading={createConversationLoading}
                  onClick={onCreateConversation}
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