"use server";

import { z } from "zod";
import { db } from "@/lib/dbConnects";
import { AuthError } from "next-auth";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/route";
import { generateVerificationToken, 
         generateTwoFactorToken  ,
} from "@/lib/token";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail";
import { getUserByEmail } from "@/data/user";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { get } from "http";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";


export const login = async (values: z.infer<typeof LoginSchema>) => {
  //console.log(values)
  const validateFields = LoginSchema.safeParse(values);
  if (!validateFields.success) return { error: "Invalid Credentials!" };

  const { email, password, code } = validateFields.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Invalid Credentials!" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );
    await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
      )

    return { success: "Verification Email Sent!" };
  }

  if(existingUser.isTwoFactorEnabled && existingUser.email) {
    if(code){
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)

      if(!twoFactorToken){
        return { error: "Invalid Two-Factor Code!" }
      }
      if(twoFactorToken.token !== code){
         return { error: "Invalid Code!"}
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date()
      if(hasExpired){
        return { error: "Two-Factor Code has expired!"}
      }

      await db.twoFactorToken.delete({
        where: { 
          id: twoFactorToken.id 
        },
      })
      const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

      if(existingConfirmation){
        await db.twoFactorConfirmation.delete({
          where: { 
            id: existingConfirmation.id 
          },
        })
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      })
      
    }else{
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(
          twoFactorToken.email,
          twoFactorToken.token,
        )
  
      return { twoFactor: true};
    }
    
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
    // return { success: "Logged in successfully" }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
};
