import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import db from "@/app/db";
import { Keypair } from "@solana/web3.js";

const handler = NextAuth({

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "", 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        }), 
    ], 
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            if(account?.provider === "google"){
                const email = user.email; 
                if(!email){
                    return false; 
                }   
                const userDb = await db.user.findFirst({
                    where: {
                        username: email
                    },
                });
                if (userDb) {
                    return true;
                }

                const keypair = Keypair.generate();
                const publicKey = keypair.publicKey.toBase58();
                const privateKey = keypair.secretKey.toString();

                await db.user.create({
                    data: {
                        username: email,
                        name: profile?.name, 
                        //@ts-ignore
                        profilePicture: profile?.picture, 
                        provider: "Google",
                        solWallet: {
                            create: {
                                publicKey: publicKey,
                                privateKey: privateKey
                            }
                        },
                        inrWallet: {
                            create: {
                                balance: 0
                            }
                        }
                    }
                })

                return true; 
            }
            return false;
        },
    }
}); 

export {handler as GET, handler as POST}