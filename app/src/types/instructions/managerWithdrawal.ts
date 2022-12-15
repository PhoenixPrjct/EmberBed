import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface ManagerWithdrawalArgs {
  bumpState: number
  closeAta: boolean
  collectionName: string
  amount: BN
}

export interface ManagerWithdrawalAccounts {
  tokenPoa: PublicKey
  manager: PublicKey
  managerAta: PublicKey
  rewardMint: PublicKey
  statePda: PublicKey
  tokenProgram: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.u8("bumpState"),
  borsh.bool("closeAta"),
  borsh.str("collectionName"),
  borsh.u64("amount"),
])

export function managerWithdrawal(
  args: ManagerWithdrawalArgs,
  accounts: ManagerWithdrawalAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.tokenPoa, isSigner: false, isWritable: true },
    { pubkey: accounts.manager, isSigner: true, isWritable: true },
    { pubkey: accounts.managerAta, isSigner: false, isWritable: true },
    { pubkey: accounts.rewardMint, isSigner: false, isWritable: false },
    { pubkey: accounts.statePda, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([8, 152, 117, 221, 148, 169, 237, 69])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      bumpState: args.bumpState,
      closeAta: args.closeAta,
      collectionName: args.collectionName,
      amount: args.amount,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
