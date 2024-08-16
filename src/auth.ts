import NextAuth from "next-auth";
import prisma from "./lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  theme: {
    logo: "/logoSmall.png",
  },
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [Google],
});
