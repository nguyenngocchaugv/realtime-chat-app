import { ISODateString } from 'next-auth';
import { Prisma, PrismaClient } from '@prisma/client';
import { conversationPopulated, participantPopulated } from '../graphql/resolvers/conversation';
import { Context } from 'graphql-ws/lib/server';
import { PubSub } from 'graphql-subscriptions';

/**
 * Server Configuration
 */

export interface GraphQLContext {
  user: User | null;
  prisma: PrismaClient;
  pubsub: PubSub;
}

export interface Session {
  user: Partial<User>;
  expires: ISODateString;
}

export interface SubscriptionContext extends Context {
  connectionParams: {
    session?: Session;
  }
}

/**
 * Users
 */

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  username: string;
  image: string;
}

export interface CreateUsernameResponse {
  success?: boolean;
  error?: string;
}

/**
 * Conversations
 */
export type ConversationPopulated = Prisma.ConversationGetPayload<{
  include: typeof conversationPopulated
}>;

export type ParticipantPopulated = Prisma.ConversationParticipantGetPayload<{
  include: typeof participantPopulated
}>;