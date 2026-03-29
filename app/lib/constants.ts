import { Connection } from "@solana/web3.js"
import axios from "axios";
import { SUPPORTED_TOKENS as INTITIAL_TOKENS, TokenDetails } from "./tokens";

let LAST_UPDATED: number | null = null; 
let SUPPORTED_TOKENS: TokenDetails[] = INTITIAL_TOKENS; 

const TOKEN_PRICE_REFRESH_INTERVAL = 60 * 1000; 

export const connection = new Connection(process.env.SOL_RPC_MAINNET ?? "");

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