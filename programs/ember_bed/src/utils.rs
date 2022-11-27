// use anchor_lang::prelude::*;
// // use anchor_spl;
// // use mpl_token_metadata;
// use std::str::FromStr;

// use crate::constants::*;
// use crate::errors::{ GenErrors };

// pub fn str_to_pubkey(key: &str) -> Pubkey {
//     Pubkey::from_str(key).unwrap()
// }

// pub fn assert_address<'info>(given: &Pubkey, expected: &str) -> bool {
//     given == &str_to_pubkey(expected)
// }

// fn verify_nft<'info>(
//     mint: Pubkey,
//     ata: Account<'info, anchor_spl::token::TokenAccount>,
//     user: Pubkey,
//     avatar_metadata: &AccountInfo<'info>,
//     expected_collection: &Pubkey
// ) -> Result<()> {
//     // Check the ATA account contains exactly 1 token
//     if !(ata.amount == 1) {
//         return Err(GenErrors::AtaAmountIsNotOne.into());
//     }

//     // Check the mint of the ATA is the right one
//     if !(ata.mint == mint) {
//         return Err(GenErrors::MintAndAtaMismatch.into());
//     }

//     // Check the user is the owner of the ATA
//     if !(ata.owner == user) {
//         return Err(GenErrors::TokenPDAMismatch.into());
//     }

//     // // // Check that we are in the list of creators and are verified
//     // let metadata = mpl_token_metadata::state::Metadata::from_account_info(avatar_metadata).unwrap();

//     // // // Check the collection is from the expected collection and that it is verified
//     // // if !check_collection(metadata, expected_collection) {
//     // //     return Err(SlaErrors::AvatarNotInCollection);
//     // // }

//     Ok(())
// }
