import { useSession } from "next-auth/react" //for client-side 

export const useCurrentUser = () => {
    const session = useSession()
    //console.log("session: ", session)
    return session.data?.user
}