use anchor_lang::prelude::*;

#[error_code]
pub enum RedeemError {
    #[msg("Not Eligible for FIRE Token")]
    NotFireEligible,
}

#[error_code]
pub enum StakeError {
    #[msg("Account already initialized")]
    AccountAlreadyInitialized,
    #[msg("Account not initialized")]
    UnintializedAccount,
    #[msg("Account is not staking anything")]
    InvalidStakeState,
}

#[error_code]
pub enum TokenStateError {
    #[msg("Account already initialized")]
    AccountAlreadyInitialized,
    #[msg("Account not initialized")]
    UnintializedAccount,
}

#[error_code]
pub enum AdminError {
    #[msg("Incorrect Managing Account")]
    IncorrectManagingAccount,
    #[msg("Not Enough Funds")]
    NotEnoughFunds,
    #[msg("No Account Found")]
    NoAccountFound,
    #[msg("Something Went Wrong")]
    GeneralError,
    #[msg("Seeds Are Not Correct")]
    InvalidSeeds,
}
#[error_code]
pub enum GenErrors {
    #[msg("The creator pubkey is not valid")]
    InvalidCreatorPubkey,

    /*** GENERAL ERRORS ***/

    #[msg("Invalid hard-coded pubkey")]
    InvalidPubkey,

    /*** CHECK OWNERSHIP ***/

    #[msg("ATA's amount is not 1")]
    AtaAmountIsNotOne,

    #[msg("Mint and ATA do not match")]
    MintAndAtaMismatch,

    #[msg("The user account is not owner of the Mint")]
    UserDoesNotOwnMint,

    #[msg("The user is not the owner of the token specified")]
    TokenPDAMismatch,

    #[msg("Avatar is not part of the collection")]
    AvatarNotInCollection,

    #[msg("Candy machine creator is not valid or unverified")]
    CreatorInvalid,
}