import { Stack, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { Conversation } from '../../../util/types';

type ConversationItemProps = {
  conversation: Conversation;
};

const ConversationItem: FC<ConversationItemProps> = ({
  conversation
}) => {
  return (
    <Stack p={4} _hover={{ bg: "whiteAlpha.200" }} borderRadius={4}>
      <Text>{conversation.id}</Text>
    </Stack>
  );
};

export default ConversationItem;