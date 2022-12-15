import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface InitializeFirePdaArgs {
  bump: number
  fireCollName: string
}

export interface InitializeFirePdaAccounts {
  firePda: PublicKey
  rewardMint: PublicKey
  tokenPoa: PublicKey
  funder: PublicKey
  funderAta: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.u8("bump"),
  borsh.str("fireCollName"),
])

export function initializeFirePda(
  args: InitializeFirePdaArgs,
  accounts: InitializeFirePdaAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.firePda, isSigner: false, isWritable: true },
    { pubkey: accounts.rewardMint, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenPoa, isSigner: false, isWritable: false },
    { pubkey: accounts.funder, isSigner: true, isWritable: true },
    { pubkey: accounts.funderAta, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([81, 210, 44, 221, 130, 75, 101, 131])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      bump: args.bump,
      fireCollName: args.fireCollName,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
