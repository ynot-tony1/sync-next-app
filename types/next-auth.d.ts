import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string            
      email: string | null; 
      token?: string;   
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub: string;          
    email: string | null; 
  }
}

