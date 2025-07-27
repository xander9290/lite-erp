// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    imageUrl: string | null;
    login: string;
    partnerId: string;
  }

  interface Session {
    user: {
      imageUrl: string;
      partnerId: string | null;
      login: string;
    } & DefaultSession["user"];
  }
}
