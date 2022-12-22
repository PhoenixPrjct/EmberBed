
import { Nft } from "@metaplex-foundation/js"
import { PublicKey } from "@solana/web3.js"
import type { SignerWalletAdapterProps } from "@solana/wallet-adapter-base";

export * from './accounts'
export * from './errors'
export * from './types'
export * from './instructions'

export * from './programId'
export type CollectionInfo = {
    address?: PublicKey
    bump?: number,
    manager?: string,
    rewardWallet?: string,
    collectionName: string,
    collectionAddress: string,
    ratePerDay?: number,
    fireEligible: boolean,
    phoenixRelation?: { kind: string },
    rewardSymbol: string,
    rewardMint: string
}

export interface AnchorWallet {
    publicKey: PublicKey;
    signTransaction: SignerWalletAdapterProps["signTransaction"];
    signAllTransactions: SignerWalletAdapterProps["signAllTransactions"];
}


export type CollectionAccounts = {
    RewTok: PublicKey,
    collectionAddress: PublicKey,
    collectionName: string,
    ratePerDay: number,
    fireEligible: boolean,
    phoenixRelation: { kind: string },
    rewardSymbol: string,
    rewardMint: string
}

export type Accounts = {
    RewTok: PublicKey,
    nft: Nft | any,
    nftTokenAddress: PublicKey,
    userRewardAta: PublicKey,
    stakeStatusPda: PublicKey,
    stakeStatusBump: number,
    delegatedAuthPda: PublicKey,
    authBump: number,
    statePDA: PublicKey,
    stateBump: number
    userAccountPDA: PublicKey,
    nftCollectionAddress: PublicKey,
    funderTokenAta: PublicKey
    rewardWallet: PublicKey
}


export interface MutableTokenInfo {
    chainId: number;
    address: string;
    name: string;
    decimals: number;
    symbol: string;
    logoURI?: string;
    tags?: string[];
}

// Server Response Types

export interface RelationsServerResponse {

    Affiliates: string[];
    Saved: string[];
    Founders: string[];
    Members: string[];
}


export interface NewCollectionResponse{
    _id: string;
    phoenix_relation: "Affiliate" | "Founder" | "Member" | "Saved" | "None";
    hashlist: string[];
    idx?: string | undefined;
    name?: string | undefined;
    pda?: string | undefined;
    reward_mint?: string | undefined;
    reward_wallet?: string | undefined;
    paid_sig?: string | undefined;
}