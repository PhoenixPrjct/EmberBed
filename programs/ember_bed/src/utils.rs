use anchor_lang::prelude::*;
// use anchor_spl::associated_token::{ get_associated_token_address };
// use anchor_spl::token::TokenAccount;
// use anchor_spl;
// use mpl_token_metadata;
use std::str::FromStr;

use crate::constants::{ FIRE_MINT };
use crate::state_and_relations::{ PhoenixUserRelation, PhoenixRelation };

pub fn str_to_pubkey(key: &str) -> Pubkey {
    Pubkey::from_str(key).unwrap()
}

pub fn get_fire_token() -> Pubkey {
    str_to_pubkey(FIRE_MINT)
}

pub fn phoenix_relation_value(relation: &PhoenixRelation) -> u64 {
    match relation {
        PhoenixRelation::None => 0,
        PhoenixRelation::Founder => 10,
        PhoenixRelation::Member => 7,
        PhoenixRelation::EmberBed => 1,
        PhoenixRelation::Saved => 2,
        PhoenixRelation::Affiliate => 3,
    }
}

pub fn phoenix_user_relation_value(relation: PhoenixUserRelation) -> u64 {
    match relation {
        PhoenixUserRelation::None => 0,
        PhoenixUserRelation::Hobby => 1,
        PhoenixUserRelation::Loyal => 3,
        PhoenixUserRelation::DieHard => 5,
        PhoenixUserRelation::Whale => 7,
    }
}

pub fn get_holder_status(qty: u32) -> PhoenixUserRelation {
    match qty {
        0 => PhoenixUserRelation::None,
        1 => PhoenixUserRelation::Hobby,
        2..=4 => PhoenixUserRelation::Loyal,
        5..=9 => PhoenixUserRelation::DieHard,
        _ => PhoenixUserRelation::Whale,
    }
}
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