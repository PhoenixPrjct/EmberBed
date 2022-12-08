use anchor_lang::prelude::*;
use std::str::FromStr;

#[derive(Debug, PartialEq, AnchorDeserialize, AnchorSerialize, Clone)]
pub enum StakeState {
    Staked,
    Unstaked,
}

impl Default for StakeState {
    fn default() -> Self {
        StakeState::Unstaked
    }
}
#[derive(Debug, PartialEq, AnchorDeserialize, AnchorSerialize, Clone)]
pub enum PhoenixRelation {
    Affiliate,
    Saved,
    Founder,
    Member,
    EmberBed,
    None,
}
impl Default for PhoenixRelation {
    fn default() -> Self {
        PhoenixRelation::None
    }
}
impl FromStr for PhoenixRelation {
    type Err = String;
    fn from_str(s: &str) -> std::result::Result<PhoenixRelation, String> {
        match s {
            "Founder" => Ok(PhoenixRelation::Founder),
            "Member" => Ok(PhoenixRelation::Member),
            "EmberBed" => Ok(PhoenixRelation::EmberBed),
            "Saved" => Ok(PhoenixRelation::Saved),
            "Affiliate" => Ok(PhoenixRelation::Affiliate),
            _ => Ok(PhoenixRelation::None),
        }
    }
}

#[derive(Debug, PartialEq, AnchorDeserialize, AnchorSerialize, Clone)]
pub enum PhoenixUserRelation {
    Hobby,
    Loyal,
    DieHard,
    Whale,
    None,
}
impl Default for PhoenixUserRelation {
    fn default() -> Self {
        PhoenixUserRelation::None
    }
}