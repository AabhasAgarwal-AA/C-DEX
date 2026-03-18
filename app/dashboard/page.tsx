import { ProfileCard } from "@/components/ProfileCard";
import db from "@/app/db";
import { authConfig } from "../lib/auth";
import { getServerSession } from "next-auth";

async function getUserBalance(){
    const session = await getServerSession(authConfig);
    const userWallet = await db.solWallet.findFirst({
        where: {
            userId: session?.user?.uid 
        }, 
        select: {
            publicKey: true
        }
    }); 
    if(!userWallet){
        return {
            error: "No Solana wallet found associated to the user"
        }
    }
    return {error: null, userWallet}; 
}

export default async function() {
    const userWallet = await getUserBalance();
    if(userWallet.error){
        return <div>
            No Solana wallet found
        </div>
    }
   return <div>
        <ProfileCard />
   </div>
}
