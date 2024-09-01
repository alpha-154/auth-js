import { UserRole } from "@prisma/client"
import NextAuth, { type DefaultSession } from "next-auth"

export type ExtendedUser = DefaultSession["user"] & {
    role: UserRole;
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
}

declare module "next-auth" {
    // interface Session{
    //   user: {
    //     role: "ADMIN" | "USER" 
    //     isTwoFactorEnabled?: boolean;
    //   } & DefaultSession ["user"]
    // }
    interface Session {
      user: ExtendedUser;
    }
  }