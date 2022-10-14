import { ISODateString } from 'next-auth';
import { PrismaClient } from '@prisma/client';

export interface GraphQLContext {
  user: User | null;
  prisma: PrismaClient;
}

/**
 * Users
 */
export interface Session {
  user: Partial<User>;
  expires: ISODateString;
}

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