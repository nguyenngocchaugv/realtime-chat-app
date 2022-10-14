import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: User;
    accessToken: string;
  }

  interface User {
    id: string;
    username: string;
  }
}