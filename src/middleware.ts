import NextAuth from "next-auth"
import authConfig from "./auth.config"
import {
     DEFAULT_LOGIN_REDIRECT,
     apiAuthPrefix,
     authRoutes,
     publicRoutes
} from "@/route"
const { auth } = NextAuth(authConfig)


export default auth((req) => {
   const { nextUrl } = req
  // console.log("req Nexturl: ",req.nextUrl)
  // console.log("req pathname: ",req.nextUrl.pathname)
   const isLoggedIn = !!req.auth 

   const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
   const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
   const isAuthRoute = authRoutes.includes(nextUrl.pathname)

   if(isApiAuthRoute){
     return 
   }
//where's next() method
   if(isAuthRoute){
      if(isLoggedIn){
         return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
      }
      return 
   }

   if(!isLoggedIn && !isPublicRoute){
      return Response.redirect(new URL("/auth/login", req.url))
   }
    
   return 
})

export const config = {
     matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
               '/(api|trpc)(.*)',
                  ]
 }

