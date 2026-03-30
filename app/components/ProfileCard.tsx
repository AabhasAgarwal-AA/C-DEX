"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { TabButton } from "./Button";
import { useState } from "react";
import { Swap } from "./Swap";
import { Assets } from "./Assests";
import { Greeting } from "./Greeting";

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

    if(session.status === "loading"){
        return <div>
            Loading...
        </div>
    }

    if(! session.data?.user){
        router.push("/");
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
            <div className={`${selectedTab === "tokens" ? "visible" : "hidden"}`}>  <Assets publicKey={publicKey} />  </div>
            <div className={`${selectedTab === "swap" ? "visible" : "hidden"}`}>  <Swap publicKey={publicKey} />  </div>

        </div>
    </div>
}

