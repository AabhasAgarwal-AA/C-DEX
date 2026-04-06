"use client";
import { useState } from "react";
import { PrimaryButton } from "./Button";

export function AddFunds({ publicKey }: { publicKey: string }) {
    const [copied, setCopied] = useState(false);

    return (
        <div className="flex justify-center mt-8 px-4 pb-5 text-center">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 w-full max-w-md space-y-4">

                <div className="text-base font-semibold text-gray-800">
                    Add Funds
                </div>

                <div className="text-sm text-gray-500">
                    Copy your Solana wallet address and use it to receive funds.
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm font-mono break-all text-gray-800">
                    {publicKey}
                </div>

                <PrimaryButton onClick={() => {
                    navigator.clipboard.writeText(publicKey);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                }}>
                    {copied ? "Copied" : "Copy Address"}
                </PrimaryButton>
            </div>
        </div>
    );
}