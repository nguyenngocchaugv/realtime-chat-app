import { Box, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import { Conversation } from '../../../util/types';
import ConversationItem from './ConversationItem';
import ConversationModal from './Modal/Modal';

type ConversationListProps = {
  session: Session;
  conversations: Conversation[];
  onViewConversation: (conversationId: string) => void;
};

const ConversationList: FC<ConversationListProps> = ({
  session,
  conversations,
  onViewConversation
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = session;

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <Box width="100%">
      <Box
        py={2}
        px={4}
        mb={4}
        bg="blackAlpha.50"
        borderRadius={4}
        cursor="pointer"
        onClick={onOpen}>
        <Text textAlign="center" color="whiteAlpha.800" fontWeight={500}>
          Find and start conversation
        </Text>
      </Box>

      <ConversationModal
        session={session}
        isOpen={isOpen}
        onClose={onClose}
      />

      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          userId={user.id}
          conversation={conversation}
          onClick={() => onViewConversation(conversation.id)}
          isSelected={conversation.id === router.query.conversationId}
        />
      ))}
    </Box>
  );
};

export default ConversationList;