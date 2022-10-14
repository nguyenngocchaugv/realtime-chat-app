import { Box, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { FC, useState } from 'react';

type ConversationListProps = {
  session: Session;
};

const ConversationList: FC<ConversationListProps> = ({
  session
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  
  return (
    <Box width="100%">
      <Box
      py={2}
      px={4}
      mb={4}
      bg="blackAlpha.50"
      borderRadius={4}
      cursor="pointer"
      onClick={() => {}}>
        <Text textAlign="center" color="whiteAlpha.800" fontWeight={500}>
          Find and start conversation
        </Text>
      </Box>
    </Box>
  );
};

export default ConversationList;