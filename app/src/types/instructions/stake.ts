import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface StakeArgs {
  collectionRewardPda: PublicKey
}

export interface StakeAccounts {
  user: PublicKey
  userRewardAta: PublicKey
  nftAta: PublicKey
  nftMintAddress: PublicKey
  nftEdition: PublicKey
  stakeStatus: PublicKey
  collectionRewardInfo: PublicKey
  rewardMint: PublicKey
  programAuthority: PublicKey
  tokenProgram: PublicKey
  metadataProgram: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([borsh.publicKey("collectionRewardPda")])

export function stake(args: StakeArgs, accounts: StakeAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.user, isSigner: true, isWritable: true },
    { pubkey: accounts.userRewardAta, isSigner: false, isWritable: true },
    { pubkey: accounts.nftAta, isSigner: false, isWritable: true },
    { pubkey: accounts.nftMintAddress, isSigner: false, isWritable: false },
    { pubkey: accounts.nftEdition, isSigner: false, isWritable: false },
    { pubkey: accounts.stakeStatus, isSigner: false, isWritable: true },
    {
      pubkey: accounts.collectionRewardInfo,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.rewardMint, isSigner: false, isWritable: false },
    { pubkey: accounts.programAuthority, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.metadataProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([206, 176, 202, 18, 200, 209, 179, 108])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      collectionRewardPda: args.collectionRewardPda,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
