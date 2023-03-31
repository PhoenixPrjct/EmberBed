import * as StakeError from "./StakeError"
import * as TokenStateError from "./TokenStateError"
import * as AdminError from "./AdminError"
import * as GenErrors from "./GenErrors"
import * as StakeState from "./StakeState"
import * as PhoenixRelation from "./PhoenixRelation"
import * as PhoenixUserRelation from "./PhoenixUserRelation"

export { StakeError }

export type StakeErrorKind =
  | StakeError.AccountAlreadyInitialized
  | StakeError.UnintializedAccount
  | StakeError.InvalidStakeState
export type StakeErrorJSON =
  | StakeError.AccountAlreadyInitializedJSON
  | StakeError.UnintializedAccountJSON
  | StakeError.InvalidStakeStateJSON

export { TokenStateError }

export type TokenStateErrorKind =
  | TokenStateError.AccountAlreadyInitialized
  | TokenStateError.UnintializedAccount
export type TokenStateErrorJSON =
  | TokenStateError.AccountAlreadyInitializedJSON
  | TokenStateError.UnintializedAccountJSON

export { AdminError }

export type AdminErrorKind =
  | AdminError.IncorrectManagingAccount
  | AdminError.NotEnoughFunds
  | AdminError.NoAccountFound
  | AdminError.GeneralError
  | AdminError.InvalidSeeds
export type AdminErrorJSON =
  | AdminError.IncorrectManagingAccountJSON
  | AdminError.NotEnoughFundsJSON
  | AdminError.NoAccountFoundJSON
  | AdminError.GeneralErrorJSON
  | AdminError.InvalidSeedsJSON

export { GenErrors }

export type GenErrorsKind =
  | GenErrors.InvalidCreatorPubkey
  | GenErrors.InvalidPubkey
  | GenErrors.AtaAmountIsNotOne
  | GenErrors.MintAndAtaMismatch
  | GenErrors.UserDoesNotOwnMint
  | GenErrors.TokenPDAMismatch
  | GenErrors.AvatarNotInCollection
  | GenErrors.CreatorInvalid
export type GenErrorsJSON =
  | GenErrors.InvalidCreatorPubkeyJSON
  | GenErrors.InvalidPubkeyJSON
  | GenErrors.AtaAmountIsNotOneJSON
  | GenErrors.MintAndAtaMismatchJSON
  | GenErrors.UserDoesNotOwnMintJSON
  | GenErrors.TokenPDAMismatchJSON
  | GenErrors.AvatarNotInCollectionJSON
  | GenErrors.CreatorInvalidJSON

export { StakeState }

export type StakeStateKind = StakeState.Staked | StakeState.Unstaked
export type StakeStateJSON = StakeState.StakedJSON | StakeState.UnstakedJSON

export { PhoenixRelation }

export type PhoenixRelationKind =
  | PhoenixRelation.Affiliate
  | PhoenixRelation.Saved
  | PhoenixRelation.Founder
  | PhoenixRelation.Evo
  | PhoenixRelation.Member
  | PhoenixRelation.EmberBed
  | PhoenixRelation.None
export type PhoenixRelationJSON =
  | PhoenixRelation.AffiliateJSON
  | PhoenixRelation.SavedJSON
  | PhoenixRelation.FounderJSON
  | PhoenixRelation.EvoJSON
  | PhoenixRelation.MemberJSON
  | PhoenixRelation.EmberBedJSON
  | PhoenixRelation.NoneJSON

export { PhoenixUserRelation }

export type PhoenixUserRelationKind =
  | PhoenixUserRelation.Hobby
  | PhoenixUserRelation.Loyal
  | PhoenixUserRelation.DieHard
  | PhoenixUserRelation.Whale
  | PhoenixUserRelation.None
export type PhoenixUserRelationJSON =
  | PhoenixUserRelation.HobbyJSON
  | PhoenixUserRelation.LoyalJSON
  | PhoenixUserRelation.DieHardJSON
  | PhoenixUserRelation.WhaleJSON
  | PhoenixUserRelation.NoneJSON
