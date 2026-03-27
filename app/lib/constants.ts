import { Connection } from "@solana/web3.js"
import axios from "axios";

let LAST_UPDATED: number | null = null; 

const TOKEN_PRICE_REFRESH_INTERVAL = 60 * 1000; 

export const connection = new Connection(process.env.SOL_RPC_MAINNET ?? "");

export interface TokenDetails {
    name: string,
    mint: string,
    native: boolean,
    price: string,
    image: string,
    decimals: number
}

export let SUPPORTED_TOKENS: TokenDetails[] = [{
    name: "SOL",
    mint: "So11111111111111111111111111111111111111112",
    native: true,
    price: "100",
    image: "https://coin-images.coingecko.com/coins/images/4128/large/solana.png?1718769756",
    decimals: 9
}, {
    name: "USDC",
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    native: false,
    price: "1",
    image: "https://coin-images.coingecko.com/coins/images/6319/large/USDC.png?1769615602",
    decimals: 6
}, {
    name: "USDT",
    mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    native: false,
    price: "1",
    image: "https://coin-images.coingecko.com/coins/images/325/large/Tether.png?1696501661",
    decimals: 6
}]
export async function getSupportedTokens(): Promise<TokenDetails[]> {
    const now = new Date().getTime();

    if (!LAST_UPDATED || now - LAST_UPDATED > TOKEN_PRICE_REFRESH_INTERVAL){
        try {

            const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h");
            const data = response.data; 

            const solana = data.find((coin: any) => coin.id == "solana"); 
            let solPrice = solana?.current_price?.toString() || "0";

            LAST_UPDATED = new Date().getTime();
            SUPPORTED_TOKENS = SUPPORTED_TOKENS.map(token =>
                token.name === "SOL"
                    ? { ...token, price: solPrice }
                    : token
            );

        } catch (error) {
            console.log(error);
        }
    }
    return SUPPORTED_TOKENS;
}

getSupportedTokens();