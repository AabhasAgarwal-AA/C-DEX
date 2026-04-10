"use client";
import axios from "axios"
import { TokenWithBalance } from "../api/hooks/useTokens"
import { PrimaryButton } from "./Button"
import { useState } from "react"
import { SUPPORTED_TOKENS } from "../lib/tokens";
import { AssetSelector } from "./AssetSelector";

export function Send({tokenBalances, publicKey}: {
    publicKey: string, 
    tokenBalances: {
        totalBalance: number,
        tokens: TokenWithBalance[]
    } | null, 
}){
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [quoteAsset, setQuoteAsset] = useState(SUPPORTED_TOKENS[0]); 
    const [amount, setAmount] = useState("");


    return <div className="p-4 text-center">
        <div className="font-semibold">
            Put the Solana address of the reciever here:
        </div>
        <div>
            <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0" 
                type="text" 
                className="block mx-auto mb-2.5 text-sm font-medium text-heading border border-default-medium text-center p-2">
            </input>
        </div>
        <div className="flex flex-col items-center gap-3 mt-3">
            <label className="text-sm text-gray-500">Select Asset</label>
            <AssetSelector 
                selectedToken={quoteAsset}  
                onSelect={(asset) => {
                    setQuoteAsset(asset)
                }}
            />
            <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                type="text"
                className="block mx-auto mb-2.5 text-sm font-medium text-heading border border-default-medium text-center p-2">
            </input>
            <PrimaryButton 
                disabled={loading}
                onClick={async () => {
                    if (!address) {
                        alert("Please enter an address");
                        return;
                    }
                    setLoading(true)
                    try {
                        const res = await axios.post("/api/send", {
                            address, 
                            quoteAsset, 
                            amount 
                        })
                        if (res.data.signature){
                            alert("Transaction successful")
                        }

                    } catch (error) {
                        console.log(error);
                        alert("Error while sending the transaction")
                    } finally {
                        setLoading(false);
                    }

            }}> 
                {loading ? "Sending..." : "Send"}
            </PrimaryButton>
        </div>
    </div>
}



