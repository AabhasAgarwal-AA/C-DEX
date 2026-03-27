import { TokenDetails } from "@/app/lib/constants";
import { useState } from "react";

interface TokenWithBalance extends TokenDetails {
    balance: string, 
    usdBalance: string 
}

export function useTokens() {
    const [tokenBalance, setTokenBalance] = useState("");
}