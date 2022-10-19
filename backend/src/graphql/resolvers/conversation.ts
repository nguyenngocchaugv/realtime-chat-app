import { ConversationParticipant, Prisma } from '@prisma/client';
import { ApolloError } from 'apollo-server-core';
import { ConversationPopulated, GraphQLContext } from '../../util/types';
import { withFilter } from 'graphql-subscriptions';

const resolvers = {
  Query: {
    conversations: async (
      _: any,
      __: any,
      context: GraphQLContext
    ): Promise<ConversationPopulated[]> => {
      const { user, prisma } = context;

      if (!user) {
        throw new ApolloError("Not authorized");
      }

      const { id: userId } = user;

      try {

        const conversations = await prisma.conversation.findMany({
          where: {
            participants: {
              every: {
                userId: {
                  equals: userId
                }
              }
            }
          },
          include: conversationPopulated
        });
        console.log('conversations', conversations);

        /**
         * Since abouve query does not work
         */
        // return conversations.filter(
        //   conversation =>
        //     !!conversation.participants.find(p => p.userId === userId)
        // );
        return conversations;

      } catch (error: any) {
        console.log("conversations error", error);
        throw new ApolloError(error?.message);
      }
    }
  },
  Mutation: {
    createConversation: async (
      _: any,
      args: { participantIds: string[]; },
      context: GraphQLContext): Promise<{ conversationId: string; }> => {
      const { user, prisma, pubsub } = context;
      const { participantIds } = args;

      if (!user) {
        throw new ApolloError("Not authorized");
      }

      const { id: userId } = user;

      try {
        const conversation = await prisma.conversation.create({
          data: {
            participants: {
              createMany: {
                data: participantIds.map(id => ({
                  userId: id,
                  hasSeenLatestMessage: id === userId
                }))
              }
            }
          },
          // include: conversationPopulated
        });

        // Emit a CONVERSATION_CREATED event using pubsub
        pubsub.publish('CONVERSATION_CREATED', {
          conversationCreated: conversation
        });

        return {
          conversationId: conversation.id
        };
      } catch (error: any) {
        console.log("createConversation error", error);
        throw new ApolloError("Error creating conversation");
      }
    },
  },
  Subscription: {
    conversationCreated: {
      // subscribe: (_: any, __: any, context: GraphQLContext) => {
      //   const { pubsub } = context;

      //   return pubsub.asyncIterator(['CONVERSATION_CREATED']);
      // }
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context;

          return pubsub.asyncIterator(['CONVERSATION_CREATED']);
        },
        (
          payload: ConversationCreatedSubscriptionPayload,
          _,
          context: GraphQLContext
        ) => {
          const { user } = context;
          const { conversationCreated: { participants } } = payload;

          const userIsParticipant = !!participants.find(p => p.userId === user?.id);

          return userIsParticipant;
        }
      )
    }
  }
};

export interface ConversationCreatedSubscriptionPayload {
  conversationCreated: ConversationPopulated;
}

export const participantPopulated = Prisma.validator<Prisma.ConversationParticipantInclude>()({
  user: {
    select: {
      id: true,
      username: true,
    }
  }
});

export const conversationPopulated =
  Prisma.validator<Prisma.ConversationInclude>()({
    participants: {
      include: participantPopulated
    },
    latestMessage: {
      select: {
        sender: {
          select: {
            id: true,
            username: true,
          }
        }
      }
    }
  });

export default resolvers;