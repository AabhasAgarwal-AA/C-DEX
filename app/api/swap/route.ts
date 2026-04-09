import { authConfig } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import db from "@/app/db";
import { Keypair, VersionedTransaction } from "@solana/web3.js";
import { connection } from "@/app/lib/constants";

export async function POST(req: NextRequest){
    const data: {
        quoteResponse: any 
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

    const { swapTransaction } = await (
        await fetch('https://lite-api.jup.ag/swap/v1/swap', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                quoteResponse: data.quoteResponse,
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
    console.log(transaction); 

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

}

function getKeypair(privateKey: string): Keypair{
    const arr = privateKey.split(",").map(x => Number(x));
    const privateKeyUintArr = Uint8Array.from(arr);
    const keypair = Keypair.fromSecretKey(privateKeyUintArr);
    return keypair;
}