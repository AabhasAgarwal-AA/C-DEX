import { authConfig } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import db from "@/app/db";
import { TokenDetails } from "@/app/lib/tokens";
import { Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import { createAssociatedTokenAccountInstruction, createTransferInstruction, getAssociatedTokenAddress } from "@solana/spl-token";
import { connection } from "@/app/lib/constants";

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

    const amount = Number(data.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
        return NextResponse.json({
            message: "Please enter a valid amount, this transaction has being canceled, please try again"
        }, {
            status: 401
        })
    }

    const sender = new PublicKey(solWallet.publicKey);
    const reciver = new PublicKey(data.address);

    const senderKeypair = getKeypair(solWallet.privateKey);
    
    if (data.quoteAsset.name === "SOL"){
        const balance = await connection.getBalance(sender);
        if (balance < amount * LAMPORTS_PER_SOL){
            return NextResponse.json({
                message: "Insufficient balance"
            }, {
                status: 401
            })
        }
        try{
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: sender, 
                    toPubkey: reciver, 
                    lamports: amount * LAMPORTS_PER_SOL
                })
            ); 
            
            transaction.feePayer = sender;
            transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

            const signature = await sendAndConfirmTransaction(
                connection, transaction, [senderKeypair]
            )
            return NextResponse.json({
                message: "Transaction successful",
                signature
            }, {
                status: 201
            });


        } catch (error){
            console.log(error);
            return NextResponse.json({
                message: "Some error occured, please try again later"
            }, {
                status: 401
            })
        }


    } else {
        const sendAssetMint = new PublicKey(data.quoteAsset.mint);
        try{
            const senderATA = await getAssociatedTokenAddress(sendAssetMint, sender);
            const senderInfo = await connection.getAccountInfo(senderATA);
            if (!senderInfo) {
                return NextResponse.json({
                    message: `Sender doesnot have a ${data.quoteAsset.name} token ATA`
                }, {
                    status: 401
                })
            }

            const tokenBalance = await connection.getTokenAccountBalance(senderATA);
            if (Number(tokenBalance.value.amount) < amount) {
                return NextResponse.json({
                    message: "Insufficient token balance"
                }, { 
                    status: 400 
                });
            }


            const reciverATA = await getAssociatedTokenAddress(sendAssetMint, reciver);
            const reciverInfo = await connection.getAccountInfo(reciverATA);

            const transaction = new Transaction();
            if (!reciverInfo) {
                transaction.add(
                    createAssociatedTokenAccountInstruction(
                        sender,
                        reciverATA,
                        reciver,
                        sendAssetMint
                    )
                );
            }
            const multiplier = Math.pow(10, data.quoteAsset.decimals);
            const adjustedAmount = amount * multiplier;

            transaction.add(
                createTransferInstruction(
                    senderATA,
                    reciverATA,
                    sender,
                    adjustedAmount
                )
            );

            transaction.feePayer = sender;
            transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

            const signature = await sendAndConfirmTransaction(connection, transaction, [senderKeypair]);

            return NextResponse.json({
                message: "Transaction successful",
                signature
            }, {
                status: 201
            });


        } catch (error){
            console.log(error);
            return NextResponse.json({
                message: "Some error occured, please try again later"
            }, {
                status: 401
            })
        }

        
    }

}

function getKeypair(privateKey: string): Keypair{
    const arr = privateKey.split(",").map(x => Number(x));
    const privateKeyUnitArr = Uint8Array.from(arr);
    const keypair = Keypair.fromSecretKey(privateKeyUnitArr);
    return keypair;
}