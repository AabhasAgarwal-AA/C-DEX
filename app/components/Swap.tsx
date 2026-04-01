"use client";
import { ReactNode, useEffect, useState } from "react"
import { SUPPORTED_TOKENS, TokenDetails } from "../lib/tokens";
import { TokenWithBalance } from "../api/hooks/useTokens";
import { PrimaryButton } from "./Button";

export function Swap({publicKey, tokenBalances} :{
    publicKey: string, 
    tokenBalances: {
        totalBalance: number,
        tokens: TokenWithBalance[]
    } | null, 
}) {

    const [baseAsset, setBaseAsset] = useState(SUPPORTED_TOKENS[0]); // 1st assest that the person is buying or selling 
    const [quoteAsset, setQuoteAsset] = useState(SUPPORTED_TOKENS[1]); // 2nd asses that the person wants to buy or sell with 
    const [baseAmount, setBaseAmount] = useState<string>();
    const [quoteAmount, setQuoteAmount] = useState<string>();

    useEffect(() => {
        if(!baseAmount){
            return 
        }


    }, [baseAsset, quoteAsset, baseAmount]);


    return <div className="p-12 bg-slate-50">
        <div className="text-2xl font-bold pb-4">
            Swap tokens 
        </div>
        <SwapInputRow 
            amount={baseAmount}
            onAmountChange={(value: string) => {
                setBaseAmount(value)
            }}
            onSelect={(asset) => {
                setBaseAsset(asset)
            }} 
            selectedToken={baseAsset} 
            title={"You pay:"} 
            topBorderEnabled={true} 
            bottomBorderEnabled={false} 
            subtitle={
                <div className="text-slate-500 pt-1 text-sm pl-1 flex">
                    <div className="font-normal pr-1">Current balance:</div> 
                    <div className="font-semibold">
                        {tokenBalances?.tokens.find(x => x.name === baseAsset.name)?.balance} {baseAsset.name}
                    </div>
                </div>} 
        />

        <div className="flex justify-center">
            <div onClick={() => {
                let baseAssetTemp = baseAsset; 
                setBaseAsset(quoteAsset)
                setQuoteAsset(baseAssetTemp)
            }} className="cursor-pointer rounded-full w-10 h-10 border absolute mt-[-20px] bg-white flex justify-center pt-2">
                <SwapIcon />
            </div>

        </div>

        <SwapInputRow 
            amount={quoteAmount} 
            onSelect={(asset) => {
                setQuoteAsset(asset)
            }}
            selectedToken={quoteAsset} 
            title={"You recieve:"} 
            topBorderEnabled={false} 
            bottomBorderEnabled={true}
            subtitle={<div className="text-slate-600">Current balance: ${tokenBalances?.tokens.find(x => x.name === quoteAsset.name)?.balance} ${quoteAsset.name}</div>}   
        />

        <div className="flex justify-end pt-4">
            <PrimaryButton onClick={() => {

            }}>Swap</PrimaryButton>
        </div>

    </div>
}

function SwapInputRow({ amount, onAmountChange, onSelect, selectedToken, title, subtitle,  topBorderEnabled, bottomBorderEnabled }: {
    amount?: string, 
    onAmountChange?: (value: string) => void,  
    onSelect: (asset: TokenDetails) => void, 
    selectedToken: TokenDetails, 
    title: string, 
    subtitle?: ReactNode, 
    topBorderEnabled: boolean, 
    bottomBorderEnabled: boolean 
}) {
    return <div className={`border flex justify-between p-6 ${topBorderEnabled ? "rounded-t-xl" : ""} ${bottomBorderEnabled ? "rounded-b-xl" : ""}`}>
        <div>
            <div className="text-sx font-semibold mb-1">
                {title}
            </div>
            <AssetSelector selectedToken={selectedToken} onSelect={() => {onSelect}} />
            {subtitle}
        </div>
        <div>
            <input onChange={(e) => onAmountChange?.(e.target.value)} placeholder="0" type="text" className="bg-slate-50 p-5 outline-none text-4xl" dir="rtl" value={amount}></input>
        </div>
    </div>
}

function AssetSelector({selectedToken, onSelect}: {
    selectedToken: TokenDetails, 
    onSelect: (asset: TokenDetails) => void
}) {
    return <div className="w-24">
        <select onChange={(e) => {
            const selectedToken = SUPPORTED_TOKENS.find(x => x.name === e.target.value)
            if(selectedToken){
                onSelect(selectedToken)
            }
        }} id="countries" className="block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body">
            {SUPPORTED_TOKENS.map(token => <option selected={selectedToken.name == token.name} key={token.name}> 
                {token.name}
            </option>)}
        </select>

    </div>
}

function SwapIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
    </svg>
}