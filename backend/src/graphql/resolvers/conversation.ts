import { ConversationParticipant, Prisma } from '@prisma/client';
import { ApolloError } from 'apollo-server-core';
import { GraphQLContext } from '../../util/types';

const resolvers = {
  Mutation: {
    createConversation: async (
      _: any,
      args: { participantIds: string[]; },
      context: GraphQLContext): Promise<{ conversationId: string }> => {
      const { user, prisma } = context;
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

        return {
          conversationId: conversation.id
        };
      } catch (error: any) {
        console.log("createConversation error", error);
        throw new ApolloError("Error creating conversation");
      }
    },
  },

};

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