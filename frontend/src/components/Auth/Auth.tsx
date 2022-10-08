import { Button, Center, Image, Input, Stack, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { signIn } from 'next-auth/react';
import React, { FC, useState } from 'react';

type IAuthProps = {
  session: Session | null;
  reloadSession: () => void;
};

const Auth: FC<IAuthProps> = ({
  session,
  reloadSession,
}) => {
  const [username, setUsername] = useState("");

  const onSubmit = async () => {
    try {
      /**
       * createUsername mutation to send our username to the GraphQL API
       */
    } catch (error) {
      console.log("onSubmit error", error);
    }
  };

  return (
    <Center height="100vh">
      <Stack spacing={8} align="center">
        {session ? (
          <>
            <Text fontSize="3xl">Create a Username</Text>
            <Input
              placeholder="Enter a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button width="100%" onClick={onSubmit}>Save</Button>
          </>
        ) : (
          <>
            <Text fontSize="3xl">MessengerQL</Text>
            <Button onClick={() => signIn("google")} leftIcon={<Image height="20px" src="/images/googlelogo.png" />}>Continure with Google</Button>
          </>
        )}
      </Stack>
    </Center>
  );
};

export default Auth;