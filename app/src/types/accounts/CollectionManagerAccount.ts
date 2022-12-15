import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CollectionManagerAccountFields {
  bump: number
  manager: PublicKey
  collection: Array<types.CollectionIdFields>
}

export interface CollectionManagerAccountJSON {
  bump: number
  manager: string
  collection: Array<types.CollectionIdJSON>
}

export class CollectionManagerAccount {
  readonly bump: number
  readonly manager: PublicKey
  readonly collection: Array<types.CollectionId>

  static readonly discriminator = Buffer.from([
    171, 113, 158, 184, 21, 14, 187, 31,
  ])

  static readonly layout = borsh.struct([
    borsh.u8("bump"),
    borsh.publicKey("manager"),
    borsh.vec(types.CollectionId.layout(), "collection"),
  ])

  constructor(fields: CollectionManagerAccountFields) {
    this.bump = fields.bump
    this.manager = fields.manager
    this.collection = fields.collection.map(
      (item) => new types.CollectionId({ ...item })
    )
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<CollectionManagerAccount | null> {
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
  ): Promise<Array<CollectionManagerAccount | null>> {
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

  static decode(data: Buffer): CollectionManagerAccount {
    if (!data.slice(0, 8).equals(CollectionManagerAccount.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = CollectionManagerAccount.layout.decode(data.slice(8))

    return new CollectionManagerAccount({
      bump: dec.bump,
      manager: dec.manager,
      collection: dec.collection.map(
        (
          item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */
        ) => types.CollectionId.fromDecoded(item)
      ),
    })
  }

  toJSON(): CollectionManagerAccountJSON {
    return {
      bump: this.bump,
      manager: this.manager.toString(),
      collection: this.collection.map((item) => item.toJSON()),
    }
  }

  static fromJSON(obj: CollectionManagerAccountJSON): CollectionManagerAccount {
    return new CollectionManagerAccount({
      bump: obj.bump,
      manager: new PublicKey(obj.manager),
      collection: obj.collection.map((item) =>
        types.CollectionId.fromJSON(item)
      ),
    })
  }
}
