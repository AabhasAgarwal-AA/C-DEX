"use client";
import { ReactNode, useEffect, useState } from "react"
import { SUPPORTED_TOKENS, TokenDetails } from "../lib/tokens";
import { TokenWithBalance } from "../api/hooks/useTokens";
import { PrimaryButton } from "./Button";
import axios from "axios";

export function Swap({publicKey, tokenBalances} :{
    publicKey: string, 
    tokenBalances: {
        totalBalance: number,
        tokens: TokenWithBalance[]
    } | null, 
}) {

    const [baseAsset, setBaseAsset] = useState(SUPPORTED_TOKENS[0]); // 1st assest that the person is buying or selling 
    const [quoteAsset, setQuoteAsset] = useState(SUPPORTED_TOKENS[1]); // 2nd asses that the person wants to buy or sell with 
    const [baseAmount, setBaseAmount] = useState<string>("");
    const [quoteAmount, setQuoteAmount] = useState<string>("");
    const [fetchingQuote, setFetchingQuote] = useState(false);
    const [quoteRespose, setQuoteResponse] = useState(null); 

    useEffect(() => {
        if (!baseAmount || isNaN(Number(baseAmount))) {
            setQuoteAmount("");
            return;
        }
        const fetchQuote = async () => {
            try {
                setFetchingQuote(true);

                const amount = Math.floor(Number(baseAmount) * 10 ** baseAsset.decimals).toString();

                axios.get(`https://lite-api.jup.ag/swap/v1/quote?inputMint=${baseAsset.mint}&outputMint=${quoteAsset.mint}&amount=${amount}&slippageBps=50`).then(res => {
                    setQuoteAmount((Number(res.data.outAmount) / 10 ** quoteAsset.decimals).toString());
                    setQuoteResponse(res.data);
                }); 
            } catch (err) {
                console.error("Quote error:", err);
                setQuoteAmount("");
            } finally {
                setFetchingQuote(false);
            }
        };

        const timer = setTimeout(fetchQuote, 400); // debounce

        return () => clearTimeout(timer);

    }, [baseAmount, baseAsset, quoteAsset]);

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
            inputDisabled={true}
            inputLoading={fetchingQuote}
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
            <PrimaryButton onClick={ async () => {
                try{
                    const res = await axios.post("/api/swap", {
                        quoteRespose
                    }); 
                    if(res.data.txnId){
                        alert("Swap done");
                    }
                } catch (error) {
                    console.log(error); 
                    alert("Error while sending the transaction")
                }
            }}>
                {fetchingQuote ? (
                    <div className="flex items-center">
                        <Spinner className="w-5 h-5 mr-2 animate-spin" />
                        Loading...
                    </div>
                ) : (
                    "Swap"
                )}
            </PrimaryButton>
        </div>

    </div>
}

function SwapInputRow({ amount, inputDisabled, inputLoading, onAmountChange, onSelect, selectedToken, title, subtitle,  topBorderEnabled, bottomBorderEnabled }: {
    amount?: string, 
    inputDisabled?: boolean, 
    inputLoading?: boolean, 
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
            <input disabled={inputDisabled} onChange={(e) => onAmountChange?.(e.target.value)} placeholder="0" type="text" className="bg-slate-50 p-5 outline-none text-4xl" dir="rtl" value={amount}> 
            </input>
        </div>
    </div>
}

function AssetSelector({selectedToken, onSelect}: {
    selectedToken: TokenDetails, 
    onSelect: (asset: TokenDetails) => void
}) {
    return <div className="w-24">
        <select value={selectedToken?.name || ""} onChange={(e) => {
            const selectedToken = SUPPORTED_TOKENS.find(x => x.name === e.target.value)
            if(selectedToken){
                onSelect(selectedToken)
            }
        }} id="countries" className="block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body">
            {SUPPORTED_TOKENS.map(token => <option value={selectedToken.name} key={token.name} selected={selectedToken.name == token.name} > 
                {token.name}
            </option>)}
        </select>

    </div>
}

function SwapIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth  ="1.5" stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
    </svg>
}

const Spinner = ({ className }: { className?: string }) => (
    <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
    >
        <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
        />
        <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
    </svg>
);