"use client";
import { signIn, signOut, useSession } from "next-auth/react"
import { PrimaryButton } from "./Button";
import { useRouter } from "next/navigation";

export const Appbar = () => {
    const session = useSession();
    const router = useRouter();

    const handleClick = () => {
        router.push("/");
    };
    return <div className={`border-b px-2 py-2 flex justify-between top-0 left-0 right-0 z-50 ${session.data?.user ? "" : "fixed"}`}>
        <div onClick={handleClick} className="text-xl font-bold flex flex-col justify-center cursor-pointer">
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