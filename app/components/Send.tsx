import { TokenWithBalance } from "../api/hooks/useTokens"

export function Send({tokenBalances, publicKey}: {
    publicKey: string, 
    tokenBalances: {
        totalBalance: number,
        tokens: TokenWithBalance[]
    } | null, 
}){
    return <div>
        {publicKey}
    </div>
}