import { getSupportedTokens, SUPPORTED_TOKENS } from "@/app/lib/constants";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { NextRequest } from "next/server";
import { connection } from "@/app/lib/constants";

export async function GET(req: NextRequest){
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address") as unknown as string; 
    const supportedTokens = await getSupportedTokens();

    const balances = await Promise.all(supportedTokens.map(token => getAccountBalance(token, address))); 
} 

async function getAccountBalance(token: {
    name: string, 
    mint: string, 
    native: boolean, 
    decimals: number
}, address: string) {
    if(token.native){
        let balance = await connection.getBalance(new PublicKey(address));
        return balance / LAMPORTS_PER_SOL;
    }

    const ata = await getAssociatedTokenAddress(
        new PublicKey(token.mint), 
        new PublicKey(address) 
    );
    const account = await getAccount(connection, ata);


}