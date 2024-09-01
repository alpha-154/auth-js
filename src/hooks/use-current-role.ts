import { useSession } from "next-auth/react" //for client component

export const useCurrentRole = () => {
    const session = useSession()
    return session.data?.user?.role
}