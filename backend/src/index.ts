import { makeExecutableSchema } from '@graphql-tools/schema';
import { PrismaClient } from '@prisma/client';
import {
  ApolloServerPluginDrainHttpServer
} from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import * as dotenv from 'dotenv';
import express from 'express';
import { PubSub } from 'graphql-subscriptions';
import { useServer } from 'graphql-ws/lib/use/ws';
import http from 'http';
import { WebSocketServer } from 'ws';
import resolvers from './graphql/resolvers';
import typeDefs from './graphql/typeDefs';
import { getUser } from './util/functions';
import { GraphQLContext, SubscriptionContext, User } from './util/types';

async function main() {
  dotenv.config();
  const app = express();
  const httpServer = http.createServer(app);

  // Create the schema, which will be used separately by ApolloServer and
  // the WebSocket server.
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers
  });

  /**
   * Context parameters
   */
  const prisma = new PrismaClient();
  const pubsub = new PubSub();

  // Create our WebSocket server using the HTTP server we just set up.
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql/subscriptions',
  });

  // Save the returned server's info so we can shutdown this server later
  const serverCleanup = useServer({
    schema, context: async (ctx: SubscriptionContext): Promise<GraphQLContext> => {
      if (ctx.connectionParams && ctx.connectionParams.session) {
        const { session } = ctx.connectionParams;
        console.log('session serverCleanup', session);
        // const 

        return { user: null, prisma, pubsub };
      }

      return { user: null, prisma, pubsub };
    },
  }, wsServer);

  const corsOptions = {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  };



  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: 'bounded',
    context: async ({ req, res }): Promise<GraphQLContext> => {
      // const session1 = await getSession({ req });
      // console.log('first', session1)
      const user = await getUser(req) as User;

      return {
        user,
        prisma,
        pubsub,
      };
    },
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });
  await server.start();
  server.applyMiddleware({ app, cors: corsOptions });
  await new Promise<void>(resolve => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

main().catch(err => console.log(err));