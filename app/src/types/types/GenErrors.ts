import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface InvalidCreatorPubkeyJSON {
  kind: "InvalidCreatorPubkey"
}

export class InvalidCreatorPubkey {
  static readonly discriminator = 0
  static readonly kind = "InvalidCreatorPubkey"
  readonly discriminator = 0
  readonly kind = "InvalidCreatorPubkey"

  toJSON(): InvalidCreatorPubkeyJSON {
    return {
      kind: "InvalidCreatorPubkey",
    }
  }

  toEncodable() {
    return {
      InvalidCreatorPubkey: {},
    }
  }
}

export interface InvalidPubkeyJSON {
  kind: "InvalidPubkey"
}

export class InvalidPubkey {
  static readonly discriminator = 1
  static readonly kind = "InvalidPubkey"
  readonly discriminator = 1
  readonly kind = "InvalidPubkey"

  toJSON(): InvalidPubkeyJSON {
    return {
      kind: "InvalidPubkey",
    }
  }

  toEncodable() {
    return {
      InvalidPubkey: {},
    }
  }
}

export interface AtaAmountIsNotOneJSON {
  kind: "AtaAmountIsNotOne"
}

export class AtaAmountIsNotOne {
  static readonly discriminator = 2
  static readonly kind = "AtaAmountIsNotOne"
  readonly discriminator = 2
  readonly kind = "AtaAmountIsNotOne"

  toJSON(): AtaAmountIsNotOneJSON {
    return {
      kind: "AtaAmountIsNotOne",
    }
  }

  toEncodable() {
    return {
      AtaAmountIsNotOne: {},
    }
  }
}

export interface MintAndAtaMismatchJSON {
  kind: "MintAndAtaMismatch"
}

export class MintAndAtaMismatch {
  static readonly discriminator = 3
  static readonly kind = "MintAndAtaMismatch"
  readonly discriminator = 3
  readonly kind = "MintAndAtaMismatch"

  toJSON(): MintAndAtaMismatchJSON {
    return {
      kind: "MintAndAtaMismatch",
    }
  }

  toEncodable() {
    return {
      MintAndAtaMismatch: {},
    }
  }
}

export interface UserDoesNotOwnMintJSON {
  kind: "UserDoesNotOwnMint"
}

export class UserDoesNotOwnMint {
  static readonly discriminator = 4
  static readonly kind = "UserDoesNotOwnMint"
  readonly discriminator = 4
  readonly kind = "UserDoesNotOwnMint"

  toJSON(): UserDoesNotOwnMintJSON {
    return {
      kind: "UserDoesNotOwnMint",
    }
  }

  toEncodable() {
    return {
      UserDoesNotOwnMint: {},
    }
  }
}

export interface TokenPDAMismatchJSON {
  kind: "TokenPDAMismatch"
}

export class TokenPDAMismatch {
  static readonly discriminator = 5
  static readonly kind = "TokenPDAMismatch"
  readonly discriminator = 5
  readonly kind = "TokenPDAMismatch"

  toJSON(): TokenPDAMismatchJSON {
    return {
      kind: "TokenPDAMismatch",
    }
  }

  toEncodable() {
    return {
      TokenPDAMismatch: {},
    }
  }
}

export interface AvatarNotInCollectionJSON {
  kind: "AvatarNotInCollection"
}

export class AvatarNotInCollection {
  static readonly discriminator = 6
  static readonly kind = "AvatarNotInCollection"
  readonly discriminator = 6
  readonly kind = "AvatarNotInCollection"

  toJSON(): AvatarNotInCollectionJSON {
    return {
      kind: "AvatarNotInCollection",
    }
  }

  toEncodable() {
    return {
      AvatarNotInCollection: {},
    }
  }
}

export interface CreatorInvalidJSON {
  kind: "CreatorInvalid"
}

export class CreatorInvalid {
  static readonly discriminator = 7
  static readonly kind = "CreatorInvalid"
  readonly discriminator = 7
  readonly kind = "CreatorInvalid"

  toJSON(): CreatorInvalidJSON {
    return {
      kind: "CreatorInvalid",
    }
  }

  toEncodable() {
    return {
      CreatorInvalid: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.GenErrorsKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("InvalidCreatorPubkey" in obj) {
    return new InvalidCreatorPubkey()
  }
  if ("InvalidPubkey" in obj) {
    return new InvalidPubkey()
  }
  if ("AtaAmountIsNotOne" in obj) {
    return new AtaAmountIsNotOne()
  }
  if ("MintAndAtaMismatch" in obj) {
    return new MintAndAtaMismatch()
  }
  if ("UserDoesNotOwnMint" in obj) {
    return new UserDoesNotOwnMint()
  }
  if ("TokenPDAMismatch" in obj) {
    return new TokenPDAMismatch()
  }
  if ("AvatarNotInCollection" in obj) {
    return new AvatarNotInCollection()
  }
  if ("CreatorInvalid" in obj) {
    return new CreatorInvalid()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(obj: types.GenErrorsJSON): types.GenErrorsKind {
  switch (obj.kind) {
    case "InvalidCreatorPubkey": {
      return new InvalidCreatorPubkey()
    }
    case "InvalidPubkey": {
      return new InvalidPubkey()
    }
    case "AtaAmountIsNotOne": {
      return new AtaAmountIsNotOne()
    }
    case "MintAndAtaMismatch": {
      return new MintAndAtaMismatch()
    }
    case "UserDoesNotOwnMint": {
      return new UserDoesNotOwnMint()
    }
    case "TokenPDAMismatch": {
      return new TokenPDAMismatch()
    }
    case "AvatarNotInCollection": {
      return new AvatarNotInCollection()
    }
    case "CreatorInvalid": {
      return new CreatorInvalid()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "InvalidCreatorPubkey"),
    borsh.struct([], "InvalidPubkey"),
    borsh.struct([], "AtaAmountIsNotOne"),
    borsh.struct([], "MintAndAtaMismatch"),
    borsh.struct([], "UserDoesNotOwnMint"),
    borsh.struct([], "TokenPDAMismatch"),
    borsh.struct([], "AvatarNotInCollection"),
    borsh.struct([], "CreatorInvalid"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
