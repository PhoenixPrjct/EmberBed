export type CustomError = NotFireEligible

export class NotFireEligible extends Error {
  static readonly code = 6000
  readonly code = 6000
  readonly name = "NotFireEligible"
  readonly msg = "Not Eligible for FIRE Token"

  constructor(readonly logs?: string[]) {
    super("6000: Not Eligible for FIRE Token")
  }
}

export function fromCode(code: number, logs?: string[]): CustomError | null {
  switch (code) {
    case 6000:
      return new NotFireEligible(logs)
  }

  return null
}
