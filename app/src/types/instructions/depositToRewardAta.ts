import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface DepositToRewardAtaArgs {
  amount: BN
}

export interface DepositToRewardAtaAccounts {
  tokenPoa: PublicKey
  statePda: PublicKey
  mint: PublicKey
  funder: PublicKey
  funderAta: PublicKey
  systemProgram: PublicKey
  rent: PublicKey
  tokenProgram: PublicKey
}

export const layout = borsh.struct([borsh.u64("amount")])

export function depositToRewardAta(
  args: DepositToRewardAtaArgs,
  accounts: DepositToRewardAtaAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.tokenPoa, isSigner: false, isWritable: true },
    { pubkey: accounts.statePda, isSigner: false, isWritable: true },
    { pubkey: accounts.mint, isSigner: false, isWritable: false },
    { pubkey: accounts.funder, isSigner: true, isWritable: true },
    { pubkey: accounts.funderAta, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([193, 219, 30, 231, 131, 27, 135, 13])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      amount: args.amount,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
