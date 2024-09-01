import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { UserRole } from "@prisma/client"
import { db } from "./lib/dbConnects"
import authConfig from "./auth.config"
import { getAccountByUserId } from "./data/account"
import { getUserByEmail, getUserById } from "./data/user"
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation"


 
export const { auth, handlers, signIn, signOut} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
      async linkAccount({user}){
        await db.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() },
        })
      }
  },
  callbacks: {
    async signIn({ user, account}){
      console.log({
        user,
        account,
      })
      // Allow OAuth without email verification
      if(account?.provider !== "credentials") return true

      const existingUser = await getUserById(user.id)

      //prevent sign in without email verification
      if(!existingUser?.emailVerified) return false

      if(existingUser.isTwoFactorEnabled){
        const twoFactorConfirmaiton = await getTwoFactorConfirmationByUserId(existingUser.id)
        if(!twoFactorConfirmaiton) return false;

        //Delete Two Factor Confirmation for next SIGNIN process
        await db.twoFactorConfirmation.delete({
          where: { 
            id: twoFactorConfirmaiton.id 
          },
        })
      }

       return true
    } ,
    async session({token, session}){
     // console.log({ sessionToken: token , session})
      if(token.sub && session.user){
        session.user.id = token.sub
        
      }
      if(token.role && session.user){
        session.user.role = token.role as UserRole
        
      }
      if( session.user){
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
        
      }
      if( session.user){
        session.user.name = token.name
        session.user.email = token.email as string //faced problem here
        session.user.isOAuth = token.isOAuth as boolean
      }

      return session;
    },
    async jwt({token}){
     // console.log({ token })
      if(!token.sub ) return token;

      const existingUser = await getUserById(token.sub)
      if(!existingUser ) return token;

      const existingAccount = await getAccountByUserId(existingUser.id)

      token.isOAuth = !!existingAccount
      token.name = existingUser.name
      token.email = existingUser.email
      token.role = existingUser.role
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled

      return token
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt"},
    ...authConfig,
})