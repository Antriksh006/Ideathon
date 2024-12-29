import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    _id?: string;
    isVerified: boolean;
    isTeacher: boolean; 
    username: string;
    isAdmin: boolean;
    isStudent:boolean;
    sid_verification:boolean;
  }

  interface Session {
    user: {
      _id
      isVerified: boolean;
      isTeacher: boolean; 
      username: string;
      isAdmin: boolean;
      isStudent:boolean;
      sid_verification:boolean;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    _id?: string;
    isVerified: boolean;
    isTeacher: boolean; 
    username: string;
    isAdmin: boolean;
    isStudent:boolean;
    sid_verification:boolean;
  }
}
