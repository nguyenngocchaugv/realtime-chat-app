import { User } from "@prisma/client";
import { ApolloError } from "apollo-server-core";
import { CreateUsernameResponse, GraphQLContext } from "../../util/types";

const resolvers = {
  Query: {
    searchUsers: async (
      _: any,
      args: { username: string; },
      context: GraphQLContext
    ): Promise<User[]> => {
      const { username: searchedUsername } = args;
      const { user, prisma } = context;

      if (!user) {
        throw new ApolloError("Not authorized");
      }

      const { id: userId } = user;

      try {
        const users = await prisma.user.findMany({
          where: {
            username: {
              contains: searchedUsername,
              mode: 'insensitive',
            },
            id: {
              not: userId
            }
            
          }
        });

        return users;
      } catch (error: any) {
        console.log("searchUsers error", error);
        throw new ApolloError(error?.message);
      }

    },
  },
  Mutation: {
    createUsername: async (
      _: any,
      args: { username: string; },
      context: GraphQLContext
    ): Promise<CreateUsernameResponse> => {
      const { username } = args;
      const { user, prisma } = context;

      console.log('HEY AT THE API', username);
      console.log('Context', context.user);

      if (!user) {
        return {
          error: 'Not authorized'
        };
      }

      const { id: userId } = user;

      try {
        /**
         * Check that username is not taken
         */
        const existingUser = await prisma.user.findUnique({
          where: {
            username,
          }
        });

        if (existingUser) {
          return {
            error: "Username already taken. Try another"
          };
        }

        /**
         * Update user
         */
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            username
          }
        });

        return {
          success: true
        }
      } catch (error: any) {
        console.log("createUsername error", error);
        throw new ApolloError(error?.message);
      }
    }
  },
};

export default resolvers;