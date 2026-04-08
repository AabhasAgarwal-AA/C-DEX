import { authConfig } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import db from "@/app/db";
import { TokenDetails } from "@/app/lib/tokens";

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


}