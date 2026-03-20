import { SUPPORTED_TOKENS } from "@/app/lib/constants";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { NextRequest } from "next/server";
import { connection } from "@/app/lib/constants";

export async function GET(req: NextRequest){
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address") as unknown as string; 

    const balances = await Promise.all(SUPPORTED_TOKENS.map(token => getAccountBalance(token, address))); 
} 

async function getAccountBalance(token: {
    name: string, 
    mint: string
}, address: string) {
    const ata = await getAssociatedTokenAddress(
        new PublicKey(token.mint), 
        new PublicKey(address) 
    );
    // const account = await getAccount()
}