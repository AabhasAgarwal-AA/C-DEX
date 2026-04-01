import { TokenWithBalance } from "@/app/api/hooks/useTokens"

export function TokenList({tokens}: {
    tokens: TokenWithBalance[]
}){
    return <div>
        {tokens.map(t => <TokenRow token={t} key={t.name} />)}
    </div>
}

function TokenRow({token}: {
    token: TokenWithBalance
}) {
    return <div className="flex justify-between">
        <div className="flex">
            <div>
                <img src={token.image} className="h-10 w-10 rounded-full mr-2" />
            </div>

            <div>
                <div className="font-bold">
                    {token.name}
                </div>
                <div className="font-slim">
                    1 {token.name} = ~${token.price}
                </div>
            </div>
        </div>

        <div>
            <div>
                <div className="font-bold flex justify-end">
                    {token.usdBalance}
                </div>
                <div className="font-slim flex justify-end">
                    {token.balance}
                </div>
            </div>
        </div>
    </div>   
}