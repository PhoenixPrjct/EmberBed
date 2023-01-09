import { useChainAPI } from "src/api/chain-api";
const { program } = useChainAPI();
export async function getAllEBCollections() {
    const collectionNames = await (await program.value.account.collectionRewardInfo.all()).map(col => col.account.collectionName)
    return collectionNames
}