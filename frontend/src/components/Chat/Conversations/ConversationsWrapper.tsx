import { useQuery } from '@apollo/client';
import { Box } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { FC } from 'react';
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
    loading: conversationLoading
  } = useQuery<ConversationData, null>(
    ConversationOperations.Queries.conversations
  );

  console.log('conversationData', conversationData);

  return (
    <Box width={{ base: '100%', md: '400px' }} bg="whiteAlpha.50" py={6} px={3}>
      <ConversationList session={session} conversations={conversationData?.conversation || []} />
    </Box>
  );
};

export default ConversationsWrapper;