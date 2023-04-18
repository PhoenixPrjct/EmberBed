import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface InitializeStatePdaArgs {
  bump: number
  rate: number
  rewardSymbol: string
  collectionName: string
  fireEligible: boolean
  phoenixCollectionRelation: string
  uuid: string
}

export interface InitializeStatePdaAccounts {
  statePda: PublicKey
  rewardMint: PublicKey
  tokenPoa: PublicKey
  nftCollectionAddress: PublicKey
  funder: PublicKey
  funderAta: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.u8("bump"),
  borsh.u32("rate"),
  borsh.str("rewardSymbol"),
  borsh.str("collectionName"),
  borsh.bool("fireEligible"),
  borsh.str("phoenixCollectionRelation"),
  borsh.str("uuid"),
])

export function initializeStatePda(
  args: InitializeStatePdaArgs,
  accounts: InitializeStatePdaAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.statePda, isSigner: false, isWritable: true },
    { pubkey: accounts.rewardMint, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenPoa, isSigner: false, isWritable: false },
    {
      pubkey: accounts.nftCollectionAddress,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.funder, isSigner: true, isWritable: true },
    { pubkey: accounts.funderAta, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([20, 235, 211, 84, 229, 139, 41, 207])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      bump: args.bump,
      rate: args.rate,
      rewardSymbol: args.rewardSymbol,
      collectionName: args.collectionName,
      fireEligible: args.fireEligible,
      phoenixCollectionRelation: args.phoenixCollectionRelation,
      uuid: args.uuid,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
