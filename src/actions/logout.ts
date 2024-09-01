"use server"

import {signOut} from "@/auth"

export const logout = async () => {
    //here, some server related works can be done
    await signOut()
}