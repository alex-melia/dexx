import NextAuth, { DefaultSession } from "next-auth"
import { User } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      initialised: boolean
      created_at: Date
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    user: {
      id: string
      token: string
      name: string
      phone: string
      role: string
      picture: string
    }
  }
}
