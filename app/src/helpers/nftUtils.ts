import { Metaplex, Nft } from "@metaplex-foundation/js"
import { PublicKey } from "@solana/web3.js";
import axios from "axios";
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { useServerAPI } from "src/api/server-api";
import { useChainAPI } from "src/api/chain-api";
import { MetadataKey } from "@nfteyez/sol-rayz/dist/config/metaplex";
import { EBNft } from "src/types";
const { connection } = useChainAPI();
const metaplex = new Metaplex(connection);
const { server_api } = useServerAPI();




async function getNftMeta(uri: string) {
    const meta = await (await axios.get(uri)).data
    await meta
    return meta

}

export async function getNftsInWallet(wallet: PublicKey) {
    const publicAddress = wallet.toBase58();
    const _nfts = await getParsedNftAccountsByOwner({ publicAddress, connection })
    const nftsPromises = _nfts.map(async (nft) => {
        const ebCollection = await server_api.nft.getCollectionFor(nft.mint);
        const meta = await getNftMeta(nft.data.uri);
        console.log(ebCollection);
        if (ebCollection) {
            return new EBNft({ ...nft, ebCollection: ebCollection, updateAuthority: nft.updateAuthority, data: { ...meta } });
        }
        return new EBNft({ ...nft, updateAuthority: nft.updateAuthority, data: { ...meta } });
    });

    const nfts = await Promise.all(nftsPromises);
    const ebnfts = nfts.filter((nft) => nft.ebCollection);
    const otherNfts = nfts.filter((nft) => !nft.ebCollection);
    return { ebNfts: ebnfts, other: otherNfts };

}