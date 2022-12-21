
import { Nft } from "@metaplex-foundation/js"
import { PublicKey } from "@solana/web3.js"

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
