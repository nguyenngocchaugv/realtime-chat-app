import { makeExecutableSchema } from '@graphql-tools/schema';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault
} from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import http from 'http';
import resolvers from './graphql/resolvers';
import typeDefs from './graphql/typeDefs';
import * as dotenv from 'dotenv';
import { GraphQLContext } from './util/types';
// import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';

async function main() {
  dotenv.config();
  const app = express();
  const httpServer = http.createServer(app);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers
  });

  const corsOptions = {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  };

  const prisma = new PrismaClient();
  
  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: 'bounded',
    context: async ({ req, res }): Promise<GraphQLContext> => {
      // const session1 = await getSession({ req });

      return {
        session: { // Fake data
          "user": {
            "name": "Ngoc Chau Nguyen",
            "email": "shinyucr3@gmail.com",
            "image": "https://lh3.googleusercontent.com/a/ALm5wu3K81LpBmxyjHnsKiIWVfat3J8P0Q-1ixcxuR7S=s96-c"
          },
          "expires": "2022-11-09T13:01:45.614Z"
        },
        prisma,
      };
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });
  await server.start();
  server.applyMiddleware({ app, cors: corsOptions });
  await new Promise<void>(resolve => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

main().catch(err => console.log(err));