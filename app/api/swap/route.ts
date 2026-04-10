import { authConfig } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import db from "@/app/db";
import { Connection, Keypair, VersionedTransaction } from "@solana/web3.js";

const connection = new Connection(process.env.SOL_RPC_MAINNET ?? "");

export async function POST(req: NextRequest){
    const data: {
        inputMint: string,
        outputMint: string,
        amount: string,
        decimals: number
    } = await req.json();


    const session = await getServerSession(authConfig); 
    if(!session?.user){
        return NextResponse.json({
            message: "You are not logged in"
        }, {
            status : 401
        });
    }
    const solWallet = await db.solWallet.findFirst({
        where: {
            userId: session.user.uid
        }
    })
    if(!solWallet){
        return NextResponse.json({
            message: "Could not find associated solana wallet"
        }, {
            status: 401 
        });
    } 

    try {
        const amountInBaseUnits = toBaseUnits(data.amount, data.decimals);
        const quoteRes = await fetch(
            `https://lite-api.jup.ag/swap/v1/quote?inputMint=${data.inputMint}&outputMint=${data.outputMint}&amount=${amountInBaseUnits.toString()}&slippageBps=50`
        );
        const quoteResponse = await quoteRes.json();
        if (!quoteResponse) {
            throw new Error("Failed to fetch quote");
        }
        const { swapTransaction } = await (
            await fetch('https://lite-api.jup.ag/swap/v1/swap', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    quoteResponse: quoteResponse,
                    userPublicKey: solWallet.publicKey.toString(),
                    dynamicComputeUnitLimit: true,
                    // dynamicSlippage: true,
                    // prioritizationFeeLamports: {
                    //     priorityLevelWithMaxLamports: {
                    //         priorityLevel: "veryHigh",
                    //         maxLamports: 1_000_000,
                    //     },
                    // },
                }),
            })
        ).json();

        const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
        var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
        // console.log(transaction); 


        const payer = getKeypair(solWallet.privateKey);
        transaction.sign([payer]);

        const latestblockhash = await connection.getLatestBlockhash();

        const rawTransaction = transaction.serialize();
        const txid = await connection.sendRawTransaction(rawTransaction, {
            skipPreflight: true,
            maxRetries: 2
        });

        await connection.confirmTransaction({
            blockhash: latestblockhash.blockhash,
            lastValidBlockHeight: latestblockhash.lastValidBlockHeight,
            signature: txid
        });

        return NextResponse.json({
            txid
        })

    } catch (error) {
        console.error("Swap error:", error);
        return NextResponse.json({
            message: "Swap failed"
        }, { 
            status: 500 
        });
    }

}

function getKeypair(privateKey: string): Keypair{
    const arr = privateKey.split(",").map(x => Number(x));
    const privateKeyUintArr = Uint8Array.from(arr);
    const keypair = Keypair.fromSecretKey(privateKeyUintArr);
    return keypair;
}

function toBaseUnits(amount: string, decimals: number): bigint {
    const [whole, fraction = ""] = amount.split(".");
    const paddedFraction = fraction.padEnd(decimals, "0").slice(0, decimals);
    return BigInt(whole + paddedFraction);
}