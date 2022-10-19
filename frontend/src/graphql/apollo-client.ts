import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { getSession } from 'next-auth/react';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:4000/graphql',
  credentials: 'include',
});

const wsLink = typeof window !== 'undefined' ?
  new GraphQLWsLink(createClient({
    url: 'ws://localhost:4000/graphql/subscriptions',
    connectionParams: async () => ({
      session: await getSession()
    })
  }))
  : null;

const link =
  typeof window !== 'undefined' && wsLink !== null
    ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wsLink,
      httpLink,
    )
    : httpLink;


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
  link: authLink.concat(link),
  cache: new InMemoryCache(),
});