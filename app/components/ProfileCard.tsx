"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { PrimaryButton } from "./Button";
import { useEffect, useState } from "react";
import { useTokens } from "@/app/api/hooks/useTokens";
import { TokenList } from "./TokenList";

export const ProfileCard = ({publicKey}: {publicKey: string}) => {

    const session = useSession();
    const router = useRouter();

    if(session.status === "loading"){
        return <div>
            Loading...
        </div>
    }

    if(! session.data?.user){
        router.push("/");
        return null; 
    }

    return <div className="pt-8 flex justify-center">
        <div className="max-w-4xl bg-white rounded shadow w-full">
            <Greeting image={session.data?.user?.image ?? ""} name={session.data?.user?.name ?? ""} />
            <Assets publicKey={publicKey} />
            {/* {JSON.stringify(session.data.user)}; */}
        </div>
    </div>
}

function Assets({ publicKey }: { publicKey: string }) {
    const [copied, setCopied] = useState(false);

    const {tokenBalances, loading} = useTokens(publicKey);
    
    useEffect(() => {
        if(copied){
            let timeout = setTimeout(() => {
                setCopied(false)
            }, 3000);
            
            return () => {
                clearTimeout(timeout); 
            }
        }

    }, [copied]);

    if(loading){
        return "Loading..."
    }
    return <div className="text-slate-500">
        <div className="mx-12 py-2">
            Account Asset
        </div>
        
        <div className="flex justify-between mx-12">
            <div className="flex">
                <div className="text-5xl font-bold text-black">
                    ${tokenBalances?.totalBalance}
                </div>

                <div className="font-slate-500 font-bold text-3xl flex flex-col justify-end pb-0 pl-2">
                    USD
                </div>
            </div>

            <div>
                <PrimaryButton onClick={() => {
                    setCopied(true)
                    navigator.clipboard.writeText(publicKey)
                }} >
                    {copied ? "Copied" : "Your Wallrt Address"}
                </PrimaryButton>
            </div>
        </div>
        <div className="pt-4 bg-slate-50 p-12 mt-4">
            <TokenList tokens={tokenBalances?.tokens || []} />
        </div>
    </div>
}

function Greeting({image, name}: {
    image: string, 
    name: string
}) {
    return <div className="flex p-12">
        <img src={image} className="rounded-full w-16 h-16 mr-4" />
        <div className="text-2xl font-semibold flex flex-col justify-center">
            {name}
        </div>
    </div>
}