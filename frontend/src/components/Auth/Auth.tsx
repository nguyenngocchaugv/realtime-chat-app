import { useMutation } from '@apollo/client';
import { Button, Center, Image, Input, Stack, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { signIn } from 'next-auth/react';
import React, { FC, useState } from 'react';
import UserOperations from '../../graphql/operations/user';
import { CreateUsernameData, CreateUsernameVariables } from '../../util/types';
import toast from 'react-hot-toast';

type IAuthProps = {
  session: Session | null;
  reloadSession: () => void;
};

const Auth: FC<IAuthProps> = ({
  session,
  reloadSession,
}) => {
  const [username, setUsername] = useState("");

  const [createUsername, { loading, error }] = useMutation<
    CreateUsernameData,
    CreateUsernameVariables
  >(UserOperations.Mutations.createUsername);

  const onSubmit = async () => {
    if (!username) return;
    try {
      const { data } = await createUsername({ variables: { username } });
      if (!data?.createUsername) {
        throw new Error();
      }

      if (data.createUsername.error) {
        const { createUsername: { error } } = data;
        toast.error(error);
        console.log('onSubmit Error', error);
      }

      /**
       * Reload session to obtain new username
       */
      toast.success("Username successfully added");
      reloadSession();
    } catch (error) {
      toast.error("There was an error");
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