import { db } from "@/lib/dbConnects"

export const getPasswordResetTokenbyToken = async (token: string) => {
    try {
        const passwordResetToken = await db.passwordResetToken.findUnique({
            where: {
                token,
            },
        })
        return passwordResetToken
    } catch (error) {
        return null
    }
}

export const getPasswordResetTokenbyEmail = async (email: string) => {
    try {
        const passwordResetToken = await db.passwordResetToken.findFirst({
            where: {
                email,
            },
        })
        return passwordResetToken
    } catch (error) {
        return null
    }
}