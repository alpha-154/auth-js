import { auth } from "@/auth" //for server-side authentication

export const currentUser = async () => {
    const session = await auth()
   
    return session?.user
}

export const currentRole = async () => {
    const session = await auth()
   
    return session?.user.role
}

