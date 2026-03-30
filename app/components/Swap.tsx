"use client";
import { useState } from "react"
import { SUPPORTED_TOKENS, TokenDetails } from "../lib/tokens";

export function Swap({publicKey} :{
    publicKey: string 
}) {

    const [baseAsset, setBaseAsset] = useState(SUPPORTED_TOKENS[0]); // 1st assest that the person is buying or selling 
    const [quoteAsset, setQuoteAsset] = useState(SUPPORTED_TOKENS[1]); // 2nd asses that the person wants to buy or sell with 

    return <div className="P-12">
        <div className="text-2xl font-bold pb-4">
            Swap tokens 
        </div>
        <SwapInputRow onSelect={(asset) => {
            setBaseAsset(asset)
        }} selectedToken={baseAsset} title={"You pay"} />

        <SwapInputRow onSelect={(asset) => {
            setQuoteAsset(asset)
        }} selectedToken={quoteAsset} title={"You recieve"} />

    </div>
}

function SwapInputRow({onSelect, selectedToken,title}: {
    onSelect: (asset: TokenDetails) => void, 
    selectedToken: TokenDetails, 
    title: string
}) {
    return <div className="border flex justify-between p-4">
        <div>
            <AssetSelector selectedToken={selectedToken} onSelect={() => {onSelect}} />
        </div>
        <div>
            {title}
        </div>
    
    </div>
}

function AssetSelector({selectedToken, onSelect}: {
    selectedToken: TokenDetails, 
    onSelect: (asset: TokenDetails) => void
}) {
    return <div>
        <select onChange={(e) => {
            const selectedToken = SUPPORTED_TOKENS.find(x => x.name === e.target.value)
            if(selectedToken){
                onSelect(selectedToken)
            }
        }} id="countries" className="block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body">
            {SUPPORTED_TOKENS.map(token => <option key={token.name}> 
                {token.name}
            </option>)}
        </select>

    </div>
}