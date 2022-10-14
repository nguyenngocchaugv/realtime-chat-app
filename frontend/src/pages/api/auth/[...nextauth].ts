import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '../../../lib/prismadb';
import jwt from 'jsonwebtoken';

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      // console.log('jtwuser-----------------------', user);
      if (user) {
        token.userId = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      const user = await prisma.user.findUnique({
        where: {
          id: token.userId as string,
        }
      });

        session.user =  {
          ...session.user,
          username: user?.username || ""
        }


      return {
        ...session,
        accessToken: jwt.sign(
          {
            id: token.userId,
          },
          process.env.NEXTAUTH_SECRET || 'gCtvpTciwl/nPSvvWQrqn+kIXB7A/SpvRXX5CtfJNDI=',
          { expiresIn: '7d' },
        ),
      };
    },
  },
});