import { Metaplex, Nft } from "@metaplex-foundation/js"
import { PublicKey } from "@solana/web3.js";
import axios from "axios";
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { useServerAPI } from "src/api/server-api";
import { useChainAPI } from "src/api/chain-api";
// import { MetadataKey } from "@nfteyez/sol-rayz/dist/config/metaplex";
import { CollectionRewardInfo, EBNft } from "src/types";
const { connection, program } = useChainAPI();
const metaplex = new Metaplex(connection);
const { server_api } = useServerAPI();




async function getNftMeta(uri: string) {
    const meta = await (await axios.get(uri)).data
    await meta
    return meta

}

async function checkNftCollectionAddress(pda: string, nftMint: string, collections: string[]): Promise<boolean | string> {
    const pdaPk = new PublicKey(pda);
    const nftMintPk = new PublicKey(nftMint);
    const collectionAddress = await (await CollectionRewardInfo.fetch(connection, pdaPk))?.toJSON().collectionAddress;
    if (!collectionAddress) return false;
    const nft = await metaplex.nfts().findByMint({ mintAddress: nftMintPk });
    // console.log({ nft_Collection_Address: nft.collection?.address.toBase58() })
    const nftCA = nft.collection?.address.toBase58()
    if (collectionAddress !== nftCA) return false;


    if (!nftCA) {
        console.log("nftCA is null")
        return false
    }
    console.log({ nftMint, nftCA, collectionAddress })
    return true
}


export async function getNftsInWallet(wallet: PublicKey) {
    const publicAddress = wallet.toBase58();

    let collections: any[] = await program.value.account.collectionRewardInfo.all();
    collections = await Promise.all(collections.map(async (col) => {
        const c = await server_api.collection.get.one(col.publicKey.toBase58());
        return !c.hashlist ? undefined : { ebCollection: col.publicKey.toBase58(), verifiedCollectionAddress: c.collectionAddress };
    }));

    // Remove undefined values from the collections array
    collections = collections.filter(col => col !== undefined);
    console.log({ collections });
    const _nfts = await getParsedNftAccountsByOwner({ publicAddress, connection })
    const nftsPromises = _nfts.map(async (nft) => {
        const ebCollection: string = await server_api.nft.getCollectionFor(nft.mint);
        const meta = await getNftMeta(nft.data.uri);
        // if (!ebCollection) {
        //     const exists = collections.find(async (c) => { await checkNftCollectionAddress(c.ebCollection, nft.mint, collections) });
        //     if (exists) {
        //         ebCollection = exists;
        //     }
        //     // console.log({ nft: nft.data.name, collection: ebCollection })
        // }


        if (!ebCollection) {
            return new EBNft({ ...nft, updateAuthority: nft.updateAuthority, data: { ...meta } });
            // console.log({ nft, ebCollection })
        }
        return new EBNft({ ...nft, ebCollection: ebCollection, updateAuthority: nft.updateAuthority, data: { ...meta } });
    });

    const nfts = await Promise.all(nftsPromises);
    const ebnfts = nfts.filter((nft) => nft.ebCollection);
    const otherNfts = nfts.filter((nft) => !nft.ebCollection);
    return { ebNfts: ebnfts, other: otherNfts };

}
