import { useChainAPI } from "src/api/chain-api";
const { program } = useChainAPI();
const PhoenixCollection = ['9xVireFnLBZ3ZCjLS29EzF632YbpSFwsKvwsqCLxefxr','4rbLs9EqZPNh2z2qkU5csWdGQALm24CEJft6tkEEd37R']

export async function getAllEBCollections() {
    const collectionNames = await (await program.value.account.collectionRewardInfo.all()).map(col => col.account.collectionName)
    return collectionNames
}