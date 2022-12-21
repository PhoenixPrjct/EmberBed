import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';


export interface MutableTokenInfo {
    chainId: number;
    address: string;
    name: string;
    decimals: number;
    symbol: string;
    logoURI?: string;
    tags?: string[];
    // extensions?: any[];
}

export async function getSplList() {
    const tokens = await (await new TokenListProvider().resolve()).filterByClusterSlug('mainnet-beta').getList();
    // console.log(tokens);
    return tokens;
};



export type SplKey = 'name' | 'symbol' | 'address'
export async function getTokenInfo(key: SplKey, val: string): Promise<TokenInfo[] | null> {
    const TokenList: TokenInfo[] = await getSplList()
    const res = TokenList.filter(token => token[key] == val)
    if (res) {
        console.log(res)
        return res;
    } else {
        return null;
    }

}
