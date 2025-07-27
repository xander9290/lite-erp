import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "./core/db/ExtendedPrisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null;
        const { email: login, password } = credentials || {};

        user = await db.find("user", ["and", ["login", "=", login]], {
          include: { partner: true },
        });

        if (!user) {
          throw new Error("Credenciales inválidas");
        }

        user = user[0];

        const verifiedPswd = await bcrypt.compare(
          password as string,
          user.password
        );

        if (!verifiedPswd) {
          throw new Error("Credenciales inválidas");
        }

        await db.update("user", user.id, {
          lastLogin: new Date(),
        });

        return {
          id: user.id,
          login: user.login,
          name: user.partner.name,
          partnerId: user.partnerId,
          imageUrl: user.partner.imageUrl,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/api/auth/login",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.login = user.login;
        token.name = user.name;
        token.picture = user.imageUrl;
        token.partnerId = user.partnerId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.login = token.login as string;
        session.user.name = token.name as string;
        session.user.imageUrl = token.imageUrl as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
