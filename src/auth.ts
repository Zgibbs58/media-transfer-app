import NextAuth from "next-auth";
import prisma from "./lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";
import Google from "next-auth/providers/google";
import Sendgrid from "next-auth/providers/sendgrid";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  theme: {
    logo: "/logoSmall.png",
  },
  adapter: PrismaAdapter(prisma) as Adapter,
  //allowing the client to have access to the user's role for the session
  callbacks: {
    session({ session, user }) {
      session.user.role = user.role;
      return session;
    },
  },
  providers: [Google, Sendgrid({ from: process.env.SENDGRID_FROM_EMAIL })],
});
