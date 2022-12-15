import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface CollectionIdFields {
  name: string
  pk: PublicKey
}

export interface CollectionIdJSON {
  name: string
  pk: string
}

export class CollectionId {
  readonly name: string
  readonly pk: PublicKey

  constructor(fields: CollectionIdFields) {
    this.name = fields.name
    this.pk = fields.pk
  }

  static layout(property?: string) {
    return borsh.struct([borsh.str("name"), borsh.publicKey("pk")], property)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new CollectionId({
      name: obj.name,
      pk: obj.pk,
    })
  }

  static toEncodable(fields: CollectionIdFields) {
    return {
      name: fields.name,
      pk: fields.pk,
    }
  }

  toJSON(): CollectionIdJSON {
    return {
      name: this.name,
      pk: this.pk.toString(),
    }
  }

  static fromJSON(obj: CollectionIdJSON): CollectionId {
    return new CollectionId({
      name: obj.name,
      pk: new PublicKey(obj.pk),
    })
  }

  toEncodable() {
    return CollectionId.toEncodable(this)
  }
}
