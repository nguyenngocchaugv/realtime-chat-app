import { Button, Flex } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { FC } from 'react';
import ConversationsWrapper from './Conversations/ConversationsWrapper';
import FeedWrapper from './Feed/FeedWrapper';

type ChatProps = {
  session: Session;
};

const Chat: FC<ChatProps> = ({
  session
}) => {

  return (
    <Flex height="100vh">
      <Button onClick={() => signOut()}>Log out</Button>
      <ConversationsWrapper session={session} />
      <FeedWrapper session={session} />
    </Flex>
  );
};

export default Chat;