import { authConfig } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import db from "@/app/db";
import { TokenDetails } from "@/app/lib/tokens";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { createAssociatedTokenAccountInstruction, createTransferInstruction, getAssociatedTokenAddress } from "@solana/spl-token";

const connection = new Connection(process.env.SOL_RPC_MAINNET ?? "");


export async function POST(req: NextRequest) {
    const data: {
        address: string, 
        quoteAsset: TokenDetails, 
        amount: string 
    } = await req.json();
    
    const session = await getServerSession(authConfig);
    if (!session?.user) {
        return NextResponse.json({
            message: "You are logged out"
        }, {
            status: 401
        })
    }

    const solWallet = await db.solWallet.findFirst({
        where: {
            userId: session.user.uid
        }
    });

    if (!solWallet) {
        return NextResponse.json({
            message: "Could not find associated solana wallet"
        }, {
            status: 401
        })
    }

    let receiver: PublicKey;

    try {
        receiver = new PublicKey(data.address);
        if (!PublicKey.isOnCurve(receiver.toBytes())) {
            return NextResponse.json({
                message: "Invalid recipient address"
            }, { 
                status: 400 
            });
        }
    } catch {
        return NextResponse.json({
            message: "Invalid recipient address"
        }, { 
            status: 400 
        });
    }

    const amount = Number(data.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
        return NextResponse.json({
            message: "Please enter a valid amount, this transaction has being canceled, please try again"
        }, {
            status: 400
        })
    }

    const sender = new PublicKey(solWallet.publicKey);

    const senderKeypair = getKeypair(solWallet.privateKey);
    
    if (data.quoteAsset.name === "SOL"){
        return await handleSolTransfer({sender, amount, receiver, senderKeypair});
    } else {
        return await handleSplTransfer({data, sender, amount, receiver, senderKeypair});        
    }

}

async function handleSolTransfer( {sender, amount, receiver, senderKeypair} : {
    sender: PublicKey, 
    amount: number, 
    receiver: PublicKey, 
    senderKeypair: Keypair
}){
    const balance = await connection.getBalance(sender);
    
    if (balance < amount * LAMPORTS_PER_SOL) {
        return NextResponse.json({
            message: "Insufficient balance"
        }, {
            status: 400
        })
    }
    try {
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: sender,
                toPubkey: receiver,
                lamports: amount * LAMPORTS_PER_SOL
            })
        );

        transaction.feePayer = sender;
        const latestBlockhash = await connection.getLatestBlockhash()
        transaction.recentBlockhash = latestBlockhash.blockhash;

        transaction.sign(senderKeypair);
        
        const signature = await connection.sendRawTransaction(
            transaction.serialize()
        );

        // try {
        //     await connection.confirmTransaction({
        //         signature,
        //         blockhash: latestBlockhash.blockhash,
        //         lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
        //     });
        // } catch (e) {
        //     console.log("Confirmation failed but tx may have succeeded");
        // }
        for (let i = 0; i < 10; i++) {
            const status = await connection.getSignatureStatus(signature);
            if (status.value?.confirmationStatus === "confirmed") {
                break;
            }
            await new Promise(r => setTimeout(r, 2000));
        }

        return NextResponse.json({
            signature
        }, {
            status: 201
        });


    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "Some error occurred, please try again later"
        }, {
            status: 500
        })
    }
}

async function handleSplTransfer({data, sender, amount, receiver, senderKeypair}: {
    data: {
        address: string,
        quoteAsset: TokenDetails,
        amount: string
    }, 
    sender: PublicKey, 
    amount: number, 
    receiver: PublicKey, 
    senderKeypair: Keypair
}){
    const sendAssetMint = new PublicKey(data.quoteAsset.mint);
    try {
        const senderATA = await getAssociatedTokenAddress(sendAssetMint, sender);
        const senderInfo = await connection.getAccountInfo(senderATA);
        if (!senderInfo) {
            return NextResponse.json({
                message: `Sender does not have a ${data.quoteAsset.name} token ATA`
            }, {
                status: 400
            })
        }
        const tokenBalance = await connection.getTokenAccountBalance(senderATA);

        let adjustedAmount = toBaseUnits(data.amount, data.quoteAsset.decimals);

        if (Number(tokenBalance.value.amount) < adjustedAmount) {
            return NextResponse.json({
                message: "Insufficient token balance"
            }, {
                status: 400
            });
        }

        const receiverATA = await getAssociatedTokenAddress(sendAssetMint, receiver);
        const receiverInfo = await connection.getAccountInfo(receiverATA);


        const transaction = new Transaction();
        if (!receiverInfo) {
            adjustedAmount
            transaction.add(
                createAssociatedTokenAccountInstruction(
                    sender,
                    receiverATA,
                    receiver,
                    sendAssetMint
                )
            );
        }

        transaction.add(
            createTransferInstruction(
                senderATA,
                receiverATA,
                sender,
                adjustedAmount
            )
        );

        transaction.feePayer = sender;
        const latestBlockhash = await connection.getLatestBlockhash();
        transaction.recentBlockhash = latestBlockhash.blockhash;

        transaction.sign(senderKeypair);

        const signature = await connection.sendRawTransaction(
            transaction.serialize()
        );

        // try {
        //     await connection.confirmTransaction(
        //         signature,
        //         "confirmed"
        //     );
        // } catch (e) {
        //     console.log("Confirmation failed but tx may have succeeded");
        // }
        for (let i = 0; i < 10; i++) {
            const status = await connection.getSignatureStatus(signature);

            if (status.value?.confirmationStatus === "confirmed") {
                break;
            }

            await new Promise(r => setTimeout(r, 2000));
        }

        return NextResponse.json({
            signature
        }, {
            status: 201
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "Some error occurred, please try again later"
        }, {
            status: 500
        })
    }

}

function getKeypair(privateKey: string): Keypair{
    const arr = privateKey.split(",").map(x => Number(x));
    const privateKeyUnitArr = Uint8Array.from(arr);
    const keypair = Keypair.fromSecretKey(privateKeyUnitArr);
    return keypair;
}

function toBaseUnits(amount: string, decimals: number): bigint {
    const [whole, fraction = ""] = amount.split(".");
    const padded = fraction.padEnd(decimals, "0").slice(0, decimals);
    return BigInt(whole + padded);
}