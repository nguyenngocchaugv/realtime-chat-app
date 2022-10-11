import { ApolloError } from "apollo-server-core";
import { CreateUsernameResponse, GraphQLContext } from "../../util/types";

const resolvers = {
  Query: {
    searchUsers: () => {

    },
  },
  Mutation: {
    createUsername: async (
      _: any,
      args: { username: string; },
      context: GraphQLContext
    ): Promise<CreateUsernameResponse> => {
      const { username } = args;
      const { session, prisma } = context;

      console.log('HEY AT THE API', username);
      console.log('Context', context);

      if (!session?.user) {
        return {
          error: 'Not authorized'
        };
      }

      const { id: userId } = session?.user;

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