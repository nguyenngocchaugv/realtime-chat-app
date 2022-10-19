import { useQuery } from '@apollo/client';
import { Box } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { FC, useEffect } from 'react';
import ConversationList from './ConversationList';
import ConversationOperations from '../../../graphql/operations/conversation';
import { ConversationsData } from '../../../util/types';
import { useRouter } from 'next/router';

type ConversationsWrapperProps = {
  session: Session;
};

const ConversationsWrapper: FC<ConversationsWrapperProps> = ({
  session
}) => {
  const router = useRouter();
  const { query: { conversationId } } = router;
  const {
    data: conversationsData,
    error: conversationError,
    loading: conversationLoading,
    subscribeToMore
  } = useQuery<ConversationsData, null>(
    ConversationOperations.Queries.conversations
  );

  const onViewConversation = async (conversationId: string) => {
    /**
     * 1. Push the conversationId to the router query params
     */
    router.push({ query: { conversationId } });

    /**
     * 2. Mark the conversation as read
     */
  };

  const subscribeToNewConversations = () => {
    subscribeToMore({
      document: ConversationOperations.Subscriptions.conversationCreated,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        // console.log('updateQuery', subscriptionData)

        const newConversation = (subscriptionData.data as any)?.conversationCreated;

        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev.conversations]
        });
      }
    });
  };

  /**
   * Execute subscription on mount
   */
  useEffect(() => {
    subscribeToNewConversations();
  }, []);


  // console.log('conversationData', conversationData);

  return (
    <Box
      display={{ base: conversationId ? 'none' : 'flex', md: "flex" }}
      width={{ base: '100%', md: '400px' }}
      bg="whiteAlpha.50"
      py={6}
      px={3}
    >
      <ConversationList
        session={session}
        conversations={conversationsData?.conversations || []}
        onViewConversation={onViewConversation}
      />
    </Box>
  );
};

export default ConversationsWrapper;