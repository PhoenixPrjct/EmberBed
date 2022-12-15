import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface InitializeCmaArgs {
  cmaBump: number
}

export interface InitializeCmaAccounts {
  managerAccount: PublicKey
  funder: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([borsh.u8("cmaBump")])

export function initializeCma(
  args: InitializeCmaArgs,
  accounts: InitializeCmaAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.managerAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.funder, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([8, 101, 171, 179, 146, 146, 127, 17])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      cmaBump: args.cmaBump,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
