use anchor_lang::prelude::*;
use anchor_spl::{ token::{ Mint, Token, TokenAccount } };
use crate::state_and_relations::{ StakeState, PhoenixRelation, PhoenixUserRelation };
use crate::constants::{ FIRE_COLLECTION_NAME };
// Staking Structs
#[derive(Accounts)]
pub struct Stake<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub user_reward_ata: Box<Account<'info, TokenAccount>>,
    #[account(
        mut, 
        associated_token::mint = nft_mint_address, 
        associated_token::authority = user,)]
    pub nft_ata: Account<'info, TokenAccount>,
    pub nft_mint_address: Account<'info, Mint>,
    /// CHECK: This is not dangerous because we don't read or write to this account.
    pub nft_edition: AccountInfo<'info>,
    #[account(
        init_if_needed,
        seeds = [user.key().as_ref(), nft_ata.key().as_ref()],
        bump,
        payer = user,
        space = std::mem::size_of::<UserStakeInfo>() + 8
    )]
    pub stake_status: Box<Account<'info, UserStakeInfo>>,
    // #[account(
    //     init_if_needed,
    //     payer = user,
    //     seeds = [user.key.as_ref()],
    //     bump,
    //     space = std::mem::size_of::<UserAccount>() + 1024
    // )]
    // pub user_account_pda: Account<'info, UserAccount>,
    #[account(mut)]
    pub collection_reward_info: Box<Account<'info, CollectionRewardInfo>>,
    /// CHECK: This is not dangerous because we don't read or write to this account.
    pub reward_mint: AccountInfo<'info>,
    /// CHECK: Only using as a signing PDA
    #[account(mut, seeds = [b"authority".as_ref()], bump)]
    pub program_authority: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
    /// CHECK: This is not dangerous because we don't read or write to this account.
    pub metadata_program: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(bump_state:u8, collection_name: String)]
pub struct RedeemReward<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        associated_token::mint = reward_mint,
        associated_token::authority = user
    )]
    pub user_reward_ata: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    pub stake_status: Account<'info, UserStakeInfo>,
    #[account(mut)]
    pub reward_wallet: Box<Account<'info, TokenAccount>>,
    #[account(
        mut,
        seeds = [reward_mint.key.as_ref(), collection_name.as_ref(), b"state".as_ref()],
        bump,)]
    pub collection_reward_info: Account<'info, CollectionRewardInfo>,
    /// CHECK: This is not dangerous because we don't read or write to this account.
    pub reward_mint: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
    // pub metadata_program: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Unstake<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut, 
        associated_token::mint = nft_mint_address, 
        associated_token::authority = user,)]
    pub nft_ata: Account<'info, TokenAccount>,
    pub nft_mint_address: Account<'info, Mint>,
    /// CHECK: This is not dangerous because we don't read or write to this account.
    pub nft_edition: AccountInfo<'info>,
    #[account(mut)]
    pub stake_status: Account<'info, UserStakeInfo>,
    // #[account(mut)]
    // pub user_account_pda: Box<Account<'info, UserAccount>>,
    /// CHECK: Only using as a signing PDA
    #[account(mut, seeds=[b"authority".as_ref()],bump)]
    pub program_authority: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
    /// CHECK: This is not dangerous because we don't read or write to this account.
    pub metadata_program: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(Default, PartialEq)]
pub struct UserStakeInfo {
    pub user_nft_ata: Pubkey,
    pub stake_start_time: i64,
    pub last_stake_redeem: i64,
    pub user_pubkey: Pubkey,
    pub stake_state: StakeState,
    pub phoenix_status: PhoenixUserRelation,
    pub collection_reward_state: Pubkey,
    pub is_initialized: bool,
    pub bump: u8,
}

#[derive(Accounts)]
#[instruction(bump_state:u8, close_ata:bool, collection_name: String, amount: u64,)]
pub struct ManagerWithdrawal<'info> {
    #[account(mut)]
    pub token_poa: Account<'info, TokenAccount>,
    /// CHECK: This is the dest
    #[account(mut)]
    pub manager: Signer<'info>,
    #[account(mut)]
    pub manager_ata: Account<'info, TokenAccount>,
    /// CHECK: This is not dangerous because we don't read or write to this account.
    pub reward_mint: AccountInfo<'info>,
    #[account(
        init_if_needed,
        payer = manager,
        seeds = [reward_mint.key().as_ref(), collection_name.as_ref(), b"state".as_ref()],
        bump,
        space = std::mem::size_of::<CollectionRewardInfo>() + 8
    )]
    pub state_pda: Account<'info, CollectionRewardInfo>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(Default)]
pub struct CollectionRewardInfo {
    pub bump: u8,
    pub rate_per_day: u32,
    pub reward_wallet: Pubkey,
    pub reward_symbol: String,
    pub collection_name: String,
    pub collection_address: Pubkey,
    pub fire_eligible: bool,
    pub _phoenix_relation: PhoenixRelation,
    pub reward_mint: Pubkey,
    pub manager: Pubkey,
    pub is_initialized: bool,
}

#[account]
#[derive(Default)]
pub struct FireRewardInfo {
    pub bump: u8,
    pub reward_wallet: Pubkey,
    pub reward_symbol: String,
    pub collection_name: String,
    pub reward_mint: Pubkey,
    pub manager: Pubkey,
    pub is_initialized: bool,
}

#[derive(Accounts)]
#[instruction(_bump : u8,_rate:u32, _reward_symbol: String, _collection_name: String, _fire_eligible: bool, _phoenix_relation: String )]
pub struct InitializeStatePda<'info> {
    #[account(
        init_if_needed,
        payer = funder,
        seeds = [reward_mint.key().as_ref(), _collection_name.as_ref(), b"state".as_ref()],
        bump,
        space = std::mem::size_of::<CollectionRewardInfo>() + 8
    )]
    pub state_pda: Account<'info, CollectionRewardInfo>,
    /// CHECK: This is not dangerous because we don't read or write to this account.
    pub reward_mint: AccountInfo<'info>,
    pub token_poa: Box<Account<'info, TokenAccount>>,
    /// CHECK: This is not dangerous because we don't read or write to this account.
    pub nft_collection_address: AccountInfo<'info>,
    #[account(mut)]
    pub funder: Signer<'info>,
    #[account(mut)]
    pub funder_ata: Account<'info, TokenAccount>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(_bump : u8,_rate:u32, _reward_symbol: String, _collection_name: String, _fire_eligible: bool, _phoenix_relation: String )]
pub struct UpdateStatePda<'info> {
    #[account(mut)]
    pub state_pda: Account<'info, CollectionRewardInfo>,
    /// CHECK: This is not dangerous because we don't read or write to this account.
    pub reward_mint: AccountInfo<'info>,
    pub token_poa: Box<Account<'info, TokenAccount>>,
    /// CHECK: This is not dangerous because we don't read or write to this account.
    pub nft_collection_address: AccountInfo<'info>,
    #[account(mut)]
    pub funder: Signer<'info>,
    #[account(mut)]
    pub funder_ata: Account<'info, TokenAccount>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(_bump : u8)]
pub struct InitializeFirePDA<'info> {
    #[account(
        init_if_needed,
        payer = funder,
        seeds = [reward_mint.key().as_ref(), FIRE_COLLECTION_NAME.as_ref(), b"fstate".as_ref()],
        bump,
        space = std::mem::size_of::<FireRewardInfo>() + 8
    )]
    pub fire_pda: Account<'info, FireRewardInfo>,
    /// CHECK: This is not dangerous because we don't read or write to this account.
    pub reward_mint: AccountInfo<'info>,
    pub token_poa: Account<'info, TokenAccount>,
    #[account(mut)]
    pub funder: Signer<'info>,
    #[account(mut)]
    pub funder_ata: Account<'info, TokenAccount>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(amount:u64)]
pub struct DepositToFirePda<'info> {
    #[account(
        mut
    )]
    pub token_poa: Account<'info, TokenAccount>,

    #[account(mut)]
    pub fire_pda: Account<'info, FireRewardInfo>,
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub funder: Signer<'info>,
    #[account(mut)]
    pub funder_ata: Account<'info, TokenAccount>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
#[instruction(amount:u64)]
pub struct DepositToTokenPda<'info> {
    #[account(
        mut
    )]
    pub token_poa: Account<'info, TokenAccount>,

    #[account(mut)]
    pub state_pda: Account<'info, CollectionRewardInfo>,
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub funder: Signer<'info>,
    #[account(mut)]
    pub funder_ata: Account<'info, TokenAccount>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    pub token_program: Program<'info, Token>,
}

// #[derive(Accounts)]
// pub struct InitializeFireInfo<'info> {
//     /// CHECK
//     pub user: Signer<'info>,
//     #[account(mut)]
//     pub fire_info: Account<'info, FireInfo>,
// }

#[derive(Accounts)]
#[instruction(_bump_fire:u8, nfts_held:u8)]
pub struct RedeemFire<'info> {
    #[account(mut)]
    pub fire_poa: Account<'info, TokenAccount>,
    /// CHECK: This is the dest
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        associated_token::mint = fire_mint,
        associated_token::authority = user
    )]
    pub user_reward_ata: Account<'info, TokenAccount>,
    #[account(mut)]
    pub stake_status: Account<'info, UserStakeInfo>,
    /// CHECK: This is not dangerous because we don't read or write to this account.
    pub fire_mint: AccountInfo<'info>,
    #[account(mut)]
    pub fire_info: Account<'info, FireRewardInfo>,
    #[account(mut)]
    pub collection_info: Account<'info, CollectionRewardInfo>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(Default)]
pub struct UserAccount {
    pub user: Pubkey,
    pub stake_status_pks: Vec<Pubkey>,
}