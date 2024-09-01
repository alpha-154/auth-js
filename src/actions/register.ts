"use server"

import { z } from "zod"
import bcrypt from "bcryptjs"
import { db } from "@/lib/dbConnects"
import { RegisterSchema } from "@/schemas"
import { getUserByEmail } from "@/data/user"
import { generateVerificationToken } from "@/lib/token"
import { sendVerificationEmail } from "@/lib/mail"


export const register = async (values: z.infer<typeof RegisterSchema>) => {
    console.log(values)
    const validateFields = RegisterSchema.safeParse(values)
    if (!validateFields.success) return { error: "Invalid Credentials!"}

    const { name, email , password} = validateFields.data
    const hashedPassword = await bcrypt.hash(password, 10)

    const existingUser = await getUserByEmail(email)

    if (existingUser) {
         return { error: "User already exists"}
    }

    await db.user.create({
         data: {
            name,
            email,
            password: hashedPassword,
         }
    })

   const verificationToken = await generateVerificationToken(email)    
   await sendVerificationEmail(
     verificationToken.email,
     verificationToken.token,
   )


    return { success: "Verification Email Sent!"}    
}