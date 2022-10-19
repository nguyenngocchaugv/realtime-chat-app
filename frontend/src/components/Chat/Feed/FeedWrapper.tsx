import { Flex } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import { FC } from 'react';
import MessagesHeader from './Messages/Header';

type FeedWrapperProps = {
  session: Session;
};

const FeedWrapper: FC<FeedWrapperProps> = ({
  session,
}) => {
  const router = useRouter();
  const { conversationId } = router.query;
  const { user } = session;

  return (
    <Flex
      display={{ base: conversationId ? 'flex' : 'none', md: "flex" }}
      width="100%"
      direction="column"
    >
      {conversationId && typeof conversationId === "string" ? (
        <Flex
          direction="column"
          justify="space-between"
          overflow="hidden"
          flexGrow={1}
        >
          <MessagesHeader
            userId={user.id}
            conversationId={conversationId}
          />
        </Flex>
      ) : (
        <div>No conversation selected</div>
      )}
    </Flex>
  );
};

export default FeedWrapper;