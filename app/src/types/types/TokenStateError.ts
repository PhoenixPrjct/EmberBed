import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface AccountAlreadyInitializedJSON {
  kind: "AccountAlreadyInitialized"
}

export class AccountAlreadyInitialized {
  static readonly discriminator = 0
  static readonly kind = "AccountAlreadyInitialized"
  readonly discriminator = 0
  readonly kind = "AccountAlreadyInitialized"

  toJSON(): AccountAlreadyInitializedJSON {
    return {
      kind: "AccountAlreadyInitialized",
    }
  }

  toEncodable() {
    return {
      AccountAlreadyInitialized: {},
    }
  }
}

export interface UnintializedAccountJSON {
  kind: "UnintializedAccount"
}

export class UnintializedAccount {
  static readonly discriminator = 1
  static readonly kind = "UnintializedAccount"
  readonly discriminator = 1
  readonly kind = "UnintializedAccount"

  toJSON(): UnintializedAccountJSON {
    return {
      kind: "UnintializedAccount",
    }
  }

  toEncodable() {
    return {
      UnintializedAccount: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.TokenStateErrorKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("AccountAlreadyInitialized" in obj) {
    return new AccountAlreadyInitialized()
  }
  if ("UnintializedAccount" in obj) {
    return new UnintializedAccount()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.TokenStateErrorJSON
): types.TokenStateErrorKind {
  switch (obj.kind) {
    case "AccountAlreadyInitialized": {
      return new AccountAlreadyInitialized()
    }
    case "UnintializedAccount": {
      return new UnintializedAccount()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "AccountAlreadyInitialized"),
    borsh.struct([], "UnintializedAccount"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
