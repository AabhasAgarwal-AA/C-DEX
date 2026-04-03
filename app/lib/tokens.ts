
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
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // mainnet mint
    // mint: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU", // devnet mint 
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