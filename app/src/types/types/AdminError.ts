import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface IncorrectManagingAccountJSON {
  kind: "IncorrectManagingAccount"
}

export class IncorrectManagingAccount {
  static readonly discriminator = 0
  static readonly kind = "IncorrectManagingAccount"
  readonly discriminator = 0
  readonly kind = "IncorrectManagingAccount"

  toJSON(): IncorrectManagingAccountJSON {
    return {
      kind: "IncorrectManagingAccount",
    }
  }

  toEncodable() {
    return {
      IncorrectManagingAccount: {},
    }
  }
}

export interface NotEnoughFundsJSON {
  kind: "NotEnoughFunds"
}

export class NotEnoughFunds {
  static readonly discriminator = 1
  static readonly kind = "NotEnoughFunds"
  readonly discriminator = 1
  readonly kind = "NotEnoughFunds"

  toJSON(): NotEnoughFundsJSON {
    return {
      kind: "NotEnoughFunds",
    }
  }

  toEncodable() {
    return {
      NotEnoughFunds: {},
    }
  }
}

export interface NoAccountFoundJSON {
  kind: "NoAccountFound"
}

export class NoAccountFound {
  static readonly discriminator = 2
  static readonly kind = "NoAccountFound"
  readonly discriminator = 2
  readonly kind = "NoAccountFound"

  toJSON(): NoAccountFoundJSON {
    return {
      kind: "NoAccountFound",
    }
  }

  toEncodable() {
    return {
      NoAccountFound: {},
    }
  }
}

export interface GeneralErrorJSON {
  kind: "GeneralError"
}

export class GeneralError {
  static readonly discriminator = 3
  static readonly kind = "GeneralError"
  readonly discriminator = 3
  readonly kind = "GeneralError"

  toJSON(): GeneralErrorJSON {
    return {
      kind: "GeneralError",
    }
  }

  toEncodable() {
    return {
      GeneralError: {},
    }
  }
}

export interface InvalidSeedsJSON {
  kind: "InvalidSeeds"
}

export class InvalidSeeds {
  static readonly discriminator = 4
  static readonly kind = "InvalidSeeds"
  readonly discriminator = 4
  readonly kind = "InvalidSeeds"

  toJSON(): InvalidSeedsJSON {
    return {
      kind: "InvalidSeeds",
    }
  }

  toEncodable() {
    return {
      InvalidSeeds: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.AdminErrorKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("IncorrectManagingAccount" in obj) {
    return new IncorrectManagingAccount()
  }
  if ("NotEnoughFunds" in obj) {
    return new NotEnoughFunds()
  }
  if ("NoAccountFound" in obj) {
    return new NoAccountFound()
  }
  if ("GeneralError" in obj) {
    return new GeneralError()
  }
  if ("InvalidSeeds" in obj) {
    return new InvalidSeeds()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(obj: types.AdminErrorJSON): types.AdminErrorKind {
  switch (obj.kind) {
    case "IncorrectManagingAccount": {
      return new IncorrectManagingAccount()
    }
    case "NotEnoughFunds": {
      return new NotEnoughFunds()
    }
    case "NoAccountFound": {
      return new NoAccountFound()
    }
    case "GeneralError": {
      return new GeneralError()
    }
    case "InvalidSeeds": {
      return new InvalidSeeds()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "IncorrectManagingAccount"),
    borsh.struct([], "NotEnoughFunds"),
    borsh.struct([], "NoAccountFound"),
    borsh.struct([], "GeneralError"),
    borsh.struct([], "InvalidSeeds"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
