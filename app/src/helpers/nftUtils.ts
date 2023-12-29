import { Metaplex, Nft } from "@metaplex-foundation/js"
import { PublicKey } from "@solana/web3.js";
import axios from "axios";
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { useServerAPI } from "src/api/server-api";
import { useChainAPI } from "src/api/chain-api";
import { useUserStore } from 'src/stores/user_store'
// import { MetadataKey } from "@nfteyez/sol-rayz/dist/config/metaplex";
import { CollectionRewardInfo, EBNft } from "src/types";
const { connection, program } = useChainAPI();
const metaplex = new Metaplex(connection);
const { server_api } = useServerAPI();


const userStore = useUserStore();


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


// async function getNftMeta(uri: string) {
//     try {
//         const meta = await (await axios.get(uri)).data
//         await meta
//         console.log(meta)
//         return meta
//     } catch (e) {
//         console.log(e)
//         return null
//     }

// }

async function getNftMeta(uri: string, mint: string) {
    try {
        const meta = await axios.get(uri);
        console.log(mint, meta.data);
        return meta.data;
    } catch (e: any) {
        if (e.response && e.response.status === 404) {
            console.log('NFT metadata not found:', uri, `\n For Token ${mint}`);
            return null;
        }
        console.log('Error fetching NFT metadata:', e, `\n For Token ${mint}`);
        return null;
    }
}
export async function getNftsInWallet(wallet: PublicKey): Promise<{ ebNfts: EBNft[], other: any[] }> {
    console.log("getNftsInWallet", wallet.toBase58())
    const publicAddress = wallet.toBase58();

    let collections: any[] = await program.value.account.collectionRewardInfo.all();
    collections = await Promise.all(collections.map(async (col) => {
        if (col.collectionAddress) { console.log({ col: col.collectionAddress.toBase58() }); }
        const c = await server_api.collection.get.one(col.publicKey.toBase58());
        return !c.hashlist ? undefined : { ebCollection: col.publicKey.toBase58(), verifiedCollectionAddress: c.vca };
    }));

    console.log({ unfiltered_collections: collections });
    // Remove undefined values from the collections array
    collections = collections.filter(col => col !== undefined);
    // console.log({ collections });
    const _nfts = await getParsedNftAccountsByOwner({ publicAddress, connection })
    console.clear();
    const nftsPromises = _nfts.map(async (nft) => {
        console.log({ nft: nft.mint })
        let ebCollection: string | undefined;
        const meta = await getNftMeta(nft.data.uri, nft.mint);
        if (!meta) {
            console.log("No Metadata found for NFT", nft.mint)
            return
        }
        const fullNft = await metaplex.nfts().findByMint({ mintAddress: new PublicKey(nft.mint) });
        if (fullNft.collection?.address) {
            const result = collections.find((c) => c.verifiedCollectionAddress == fullNft.collection?.address.toBase58())
            console.log("Found Verified Collection for", nft.mint, { nft: fullNft.collection.address.toBase58(), result: result })
            ebCollection = result?.ebCollection ? result.ebCollection : null;
        }
        if (!ebCollection) {

            ebCollection = await server_api.nft.getCollectionFor(nft.mint);

            console.log({ nft: nft.mint, EB_BY_HASHLIST: ebCollection })
        }


        if (!ebCollection) {
            return new EBNft({ ...nft, updateAuthority: nft.updateAuthority, data: { ...meta } });
            // console.log({ nft, ebCollection })
        }
        // console.clear()
        // console.log({ ebCollection })
        return new EBNft({ ...nft, ebCollection: ebCollection, updateAuthority: nft.updateAuthority, data: { ...meta } });
    });

    const nfts = await Promise.all(nftsPromises);
    console.log(nfts)
    const ebnfts = nfts.filter((nft) => nft?.ebCollection).map((obj) => { if (obj !== undefined) return { ...obj } });
    console.log({ ebnfts })
    userStore.setHeld(ebnfts.length);
    const otherNfts = nfts.filter((nft) => !nft?.ebCollection);
    return { ebNfts: ebnfts, other: otherNfts };

}
