import authConfig from "@/auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { User } from "@prisma/client"
import NextAuth, { type DefaultSession } from "next-auth"

import { prisma } from "./lib/prisma"
import { getUserById } from "@/lib/user"

// More info: https://authjs.dev/getting-started/typescript#module-augmentation
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      image: string
      name: string
    } & DefaultSession["user"]
  }
}

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ token, session }) {
      if (session.user) {
        if (token.sub) {
          session.user.id = token.sub
        }

        if (token.email) {
          session.user.email = token.email
        }

        if (token.name) {
          session.user.name = token.name
        }

        if (token.image) {
          session.user.image = token.image as string
        }
      }

      return session
    },

    async jwt({ token }) {
      if (!token.sub) return token

      const dbUser = await getUserById(token.sub)

      if (!dbUser) return token

      token.email = dbUser.email
      token.name = dbUser.name
      token.image = dbUser.image

      return token
    },
  },
  ...authConfig,
})
