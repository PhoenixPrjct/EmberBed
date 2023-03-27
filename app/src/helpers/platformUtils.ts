import { useChainAPI } from "src/api/chain-api";

export async function getAllEBCollections() {
    const { program } = useChainAPI();
    if (!program.value) return
    const collectionNames = await (await program.value.account.collectionRewardInfo.all()).map(col => col.account.collectionName);
    return collectionNames
}

export function getExplorerURL(sig: string) {
    if (process.env.NODE_ENV !== "production") {
        return `https://explorer.solana.com/tx/${sig}?cluster=devnet`
    }
    return `https://explorer.solana.com/tx/${sig}`

}