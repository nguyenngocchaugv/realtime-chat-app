import { useQuery } from '@apollo/client';
import { Box } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { FC, useEffect } from 'react';
import ConversationList from './ConversationList';
import ConversationOperations from '../../../graphql/operations/conversation';
import { ConversationData } from '../../../util/types';

type ConversationsWrapperProps = {
  session: Session;
};

const ConversationsWrapper: FC<ConversationsWrapperProps> = ({
  session
}) => {
  const {
    data: conversationData,
    error: conversationError,
    loading: conversationLoading,
    subscribeToMore
  } = useQuery<ConversationData, null>(
    ConversationOperations.Queries.conversations
  );

  const subscribeToNewConversations = () => {
    subscribeToMore({
      document: ConversationOperations.Subscriptions.conversationCreated,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        console.log('updateQuery', subscriptionData)

        const newConversation = (subscriptionData.data as any)?.conversationCreated;

        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev.conversations]
        })
      }
    })
  };

  /**
   * Execute subscription on mount
   */
  useEffect(() => {
    subscribeToNewConversations();
  }, []);
  

  console.log('conversationData', conversationData);

  return (
    <Box width={{ base: '100%', md: '400px' }} bg="whiteAlpha.50" py={6} px={3}>
      <ConversationList session={session} conversations={conversationData?.conversations || []} />
    </Box>
  );
};

export default ConversationsWrapper;