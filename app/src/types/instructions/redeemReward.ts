import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface RedeemRewardArgs {
  bumpState: number
  collectionName: string
}

export interface RedeemRewardAccounts {
  user: PublicKey
  userRewardAta: PublicKey
  stakeStatus: PublicKey
  rewardWallet: PublicKey
  collectionRewardInfo: PublicKey
  rewardMint: PublicKey
  tokenProgram: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.u8("bumpState"),
  borsh.str("collectionName"),
])

export function redeemReward(
  args: RedeemRewardArgs,
  accounts: RedeemRewardAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.user, isSigner: true, isWritable: true },
    { pubkey: accounts.userRewardAta, isSigner: false, isWritable: true },
    { pubkey: accounts.stakeStatus, isSigner: false, isWritable: true },
    { pubkey: accounts.rewardWallet, isSigner: false, isWritable: true },
    {
      pubkey: accounts.collectionRewardInfo,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.rewardMint, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([20, 221, 205, 146, 25, 114, 178, 198])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      bumpState: args.bumpState,
      collectionName: args.collectionName,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
