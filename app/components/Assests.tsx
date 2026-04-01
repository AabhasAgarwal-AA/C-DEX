"use client";
import { useEffect, useState } from "react";
import { TokenWithBalance, useTokens } from "../api/hooks/useTokens";
import { PrimaryButton } from "./Button";
import { TokenList } from "./TokenList";

export
    function Assets({ publicKey, tokenBalances, loading }: { 
        publicKey: string, 
        tokenBalances: {
            totalBalance: number,
            tokens: TokenWithBalance[]
        } | null, 
        loading: boolean
    }) {
    const [copied, setCopied] = useState(false);


    useEffect(() => {
        if (copied) {
            let timeout = setTimeout(() => {
                setCopied(false)
            }, 3000);

            return () => {
                clearTimeout(timeout);
            }
        }

    }, [copied]);

    if (loading) {
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
                    {copied ? "Copied" : "Your Wallet Address"}
                </PrimaryButton>
            </div>
        </div>
        <div className="pt-4 bg-slate-50 p-12 mt-4">
            <TokenList tokens={tokenBalances?.tokens || []} />
        </div>
    </div>
}