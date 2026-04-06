"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { TabButton } from "./Button";
import { useEffect, useState } from "react";
import { Swap } from "./Swap";
import { Assets } from "./Assests";
import { Greeting } from "./Greeting";
import { useTokens } from "../api/hooks/useTokens";
import { Withdraw } from "./Withdraw";
import { AddFunds } from "./AddFunds";
import { Send } from "./Send";

type Tab = "tokens" | "send" | "add_funds" | "swap" | "withdraw"; 
const tabs: {id: Tab, name: string}[] = [
    {id: "tokens", name: "Tokens"}, 
    {id: "send", name: "Send"}, 
    {id: "add_funds", name: "Add Funds"}, 
    {id: "withdraw", name: "Withdraw"},
    {id: "swap", name: "Swap"}
];

export const ProfileCard = ({publicKey}: {publicKey: string}) => {

    const session = useSession();
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState<Tab>("tokens");
    const { tokenBalances, loading } = useTokens(publicKey);

    useEffect(() => {
        if (session.status === "unauthenticated") {
            router.push("/");
        }
    }, [session.status, router]);

    if (session.status === "loading") {
        return <div className="flex justify-center py-8">Loading...</div>;
    }

    if(!session.data?.user){
        // router.push("/");
        return null; 
    }

    return <div className="pt-8 flex justify-center">
        <div className="max-w-4xl bg-white rounded shadow w-full">
            <Greeting image={session.data?.user?.image ?? ""} name={session.data?.user?.name ?? ""} />

            <div className="w-full flex px-10">
                {tabs.map(tab => <TabButton key={tab.id} active={tab.id === selectedTab} onClick={() => {
                    setSelectedTab(tab.id)
                }}>{tab.name}</TabButton>)}
            </div>

            {/* {JSON.stringify(session.data.user)}; */}
            <div className={`${selectedTab === "tokens" ? "visible" : "hidden"}`}><Assets tokenBalances={tokenBalances} loading={loading} publicKey={publicKey} /></div>

            <div className={`${selectedTab === "swap" ? "visible" : "hidden"}`}><Swap tokenBalances={tokenBalances} publicKey={publicKey} /></div> 

            <div className={`${selectedTab == "withdraw" ? "visible" : "hidden"}`}><Withdraw /></div> 

            <div className={`${selectedTab == "add_funds" ? "visible" : "hidden"}`}><AddFunds publicKey={publicKey} /> </div>

            <div className={`${selectedTab == "send" ? "visible" : "hidden"}`}><Send tokenBalances={tokenBalances} publicKey={publicKey} /></div>
        
        </div>
    </div>
}