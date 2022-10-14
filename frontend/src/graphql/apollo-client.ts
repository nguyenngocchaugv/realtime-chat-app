import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { getSession } from 'next-auth/react';
import { setContext } from '@apollo/client/link/context';

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:4000/graphql',
  credentials: 'include',
});

const authLink = setContext(async (_, { headers }) => {
  const session = await getSession();

  const accessToken = session?.accessToken;

  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  };
});


export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});