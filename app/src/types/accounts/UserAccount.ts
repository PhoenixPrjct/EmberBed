import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UserAccountFields {
  user: PublicKey
  stakeStatusPks: Array<PublicKey>
}

export interface UserAccountJSON {
  user: string
  stakeStatusPks: Array<string>
}

export class UserAccount {
  readonly user: PublicKey
  readonly stakeStatusPks: Array<PublicKey>

  static readonly discriminator = Buffer.from([
    211, 33, 136, 16, 186, 110, 242, 127,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("user"),
    borsh.vec(borsh.publicKey(), "stakeStatusPks"),
  ])

  constructor(fields: UserAccountFields) {
    this.user = fields.user
    this.stakeStatusPks = fields.stakeStatusPks
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<UserAccount | null> {
    const info = await c.getAccountInfo(address)

    if (info === null) {
      return null
    }
    if (!info.owner.equals(PROGRAM_ID)) {
      throw new Error("account doesn't belong to this program")
    }

    return this.decode(info.data)
  }

  static async fetchMultiple(
    c: Connection,
    addresses: PublicKey[]
  ): Promise<Array<UserAccount | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses)

    return infos.map((info) => {
      if (info === null) {
        return null
      }
      if (!info.owner.equals(PROGRAM_ID)) {
        throw new Error("account doesn't belong to this program")
      }

      return this.decode(info.data)
    })
  }

  static decode(data: Buffer): UserAccount {
    if (!data.slice(0, 8).equals(UserAccount.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = UserAccount.layout.decode(data.slice(8))

    return new UserAccount({
      user: dec.user,
      stakeStatusPks: dec.stakeStatusPks,
    })
  }

  toJSON(): UserAccountJSON {
    return {
      user: this.user.toString(),
      stakeStatusPks: this.stakeStatusPks.map((item) => item.toString()),
    }
  }

  static fromJSON(obj: UserAccountJSON): UserAccount {
    return new UserAccount({
      user: new PublicKey(obj.user),
      stakeStatusPks: obj.stakeStatusPks.map((item) => new PublicKey(item)),
    })
  }
}
