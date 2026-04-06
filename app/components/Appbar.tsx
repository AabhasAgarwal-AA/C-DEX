"use client";
import { signIn, signOut, useSession } from "next-auth/react"
import { PrimaryButton } from "./Button"

export const Appbar = () => {
    const session = useSession();
    return <div className={`border-b px-2 py-2 flex justify-between top-0 left-0 right-0 z-50 ${session.data?.user ? "" : "fixed"}`}>
        <div className="text-xl font-bold flex flex-col justify-center">
            C-DEX 
        </div>

        <div>
            {session.data?.user ? 
                <PrimaryButton onClick={() => {signOut()}}>Logout</PrimaryButton> : 
                <PrimaryButton onClick={() => {signIn()}}>Signin</PrimaryButton>
            }
        </div>

    </div>
}