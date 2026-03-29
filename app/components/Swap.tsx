"use client";
import { useState } from "react"
import { SUPPORTED_TOKENS, TokenDetails } from "../lib/tokens";

export function Swap({publicKey} :{
    publicKey: string 
}) {

    const [baseAssest, setBaseAsset] = useState(SUPPORTED_TOKENS[0]); // 1st assest that the person is buying or selling 
    const [quoteAssest, setQuoteAssest] = useState(SUPPORTED_TOKENS[1]); // 2nd asses that the person wants to buy or sell with 

    return <div>
        <SwapInputRow onSelect={() => {
            // setBaseAsset()
        }} />

    </div>
}

function SwapInputRow({onSelect}: {
    onSelect: (asset: TokenDetails) => void
}) {
    return <div className="border flex justify-between">
        <AssetSelector />
    
    </div>
}

function AssetSelector() {
    return <div>

    </div>
}