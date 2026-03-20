import { Connection } from "@solana/web3.js"

export const SUPPORTED_TOKENS : {
    name: string, 
    mint: string 
}[] = [{
    name: "SOL", 
    mint: "So11111111111111111111111111111111111111112"
}, {
    name: "USDC", 
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
}, {
    name: "USDT",
    mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB" 
}]

export const connection = new Connection(process.env.SOL_RPC_DEVNET ?? "");