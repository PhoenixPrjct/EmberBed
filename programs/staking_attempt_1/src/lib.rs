use anchor_lang::prelude::*;
use anchor_lang::solana_program::{ program::invoke_signed };
use anchor_spl::token;
use anchor_spl::{
    // associated_token::{ AssociatedToken, create },
    token::{ Approve, Mint, Revoke, Token, TokenAccount, Transfer, CloseAccount, close_account },
};

declare_id!("4vgptm7p9MkhuW1MEADupJmEjFQX2wRuW8SQaQxUsJcD");
const LPS: u64 = 1_000_000_000;

#[program]
pub mod staking_attempt_1 {
    use super::*;

    pub fn stake(ctx: Context<Stake>) -> Result<()> {
        msg!("Staking Program Invoked");
        if ctx.accounts.stake_status.stake_state == StakeState::Staked {
            msg!("NFT is already staked");
            return Ok(());
        }
        // Get Clock
        let timestamp = Clock::get().unwrap();
        // Cross Program Invocation to Approve Delegation
        let token_program_cpi_approve_program = ctx.accounts.token_program.to_account_info();
        let token_program_cpi_approve_accounts = Approve {
            to: ctx.accounts.nft_ata.to_account_info(),
            delegate: ctx.accounts.program_authority.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let approval_cpi_ctx = CpiContext::new(
            token_program_cpi_approve_program,
            token_program_cpi_approve_accounts
        );
        msg!("Cross Program Invocation to Approve Instructions on Token Program");
        token::approve(approval_cpi_ctx, 1)?;

        let auth_bump = *ctx.bumps.get("program_authority").unwrap();
        msg!("Authority_bump: {}", auth_bump);
        msg!("Cross Program Invocation to Invoke Freeze Instructions on Token Program");
        invoke_signed(
            &mpl_token_metadata::instruction::freeze_delegated_account(
                ctx.accounts.metadata_program.key(),
                ctx.accounts.program_authority.key(),
                ctx.accounts.nft_ata.key(),
                ctx.accounts.nft_edition.key(),
                ctx.accounts.nft_mint_address.key()
            ),
            &[
                ctx.accounts.program_authority.to_account_info(),
                ctx.accounts.nft_ata.to_account_info(),
                ctx.accounts.nft_edition.to_account_info(),
                ctx.accounts.nft_mint_address.to_account_info(),
                ctx.accounts.metadata_program.to_account_info(),
            ],
            &[&[b"authority", &[auth_bump]]]
        )?;

        // if ctx.accounts.stake_status.is_initialized{
        //     msg!("Account is already initialized");
        //     return err!(StakeError::AccountAlreadyInitialized);
        // }
        // let program_id = &ctx.program_id.key();
        // let (collection_reward_state, _bump) = Pubkey::find_program_address(
        //     &[ctx.accounts.reward_mint.key.as_ref(), b"state".as_ref()],
        //     program_id
        // );
        // msg!("Reward State Key: {:?}", collection_reward_state.key());
        // ctx.accounts.user_reward_info.user_reward_ata = ctx.accounts.user_reward_ata.key();
        ctx.accounts.stake_status.collection_reward_state =
            ctx.accounts.collection_reward_info.key();
        ctx.accounts.stake_status.user_nft_ata = ctx.accounts.nft_ata.key();
        ctx.accounts.stake_status.stake_start_time = timestamp.unix_timestamp;
        ctx.accounts.stake_status.last_stake_redeem = timestamp.unix_timestamp;
        ctx.accounts.stake_status.user_pubkey = ctx.accounts.user.key();
        ctx.accounts.stake_status.stake_state = StakeState::Staked;
        ctx.accounts.stake_status.is_initialized = true;

        // Messages to confirm info passed to program
        msg!("NFT token account: {:?}", ctx.accounts.stake_status.user_nft_ata);
        msg!("User pubkey: {:?}", ctx.accounts.stake_status.user_pubkey);
        msg!("Stake state: {:?}", ctx.accounts.stake_status.stake_state);
        msg!("Stake start time: {:?}", ctx.accounts.stake_status.stake_start_time);
        msg!("Time since last redeem: {:?}", ctx.accounts.stake_status.last_stake_redeem);
        msg!("NFT Token Being Staked: {:?} ", ctx.accounts.nft_mint_address);
        Ok(())
    }

    pub fn redeem_reward(
        ctx: Context<RedeemReward>,
        bump_state: u8,
        collection_name: String
    ) -> Result<()> {
        msg!("Collection Name: {:?}", ctx.accounts.collection_reward_info.collection_name);
        msg!("Collection Name Argument {:?}", collection_name);
        if !ctx.accounts.stake_status.is_initialized {
            msg!("Account is not initialized");
            return err!(StakeError::UnintializedAccount);
        }
        if ctx.accounts.stake_status.stake_state != StakeState::Staked {
            msg!("Stake account is not staking anything");
            return err!(StakeError::InvalidStakeState);
        }

        // let bump_state = *ctx.bumps.get("state").unwrap();
        // let bump_state = ctx.accounts.collection_reward_info.bump;
        let user_reward_ata = ctx.accounts.user_reward_ata.key();
        msg!("Bump State: {:?}", bump_state);
        let timestamp = Clock::get().unwrap();
        let stake_status = &ctx.accounts.stake_status;
        let state = &ctx.accounts.collection_reward_info;
        let reward_wallet = &ctx.accounts.reward_wallet.to_account_info();

        let reward_mint = &ctx.accounts.reward_mint.to_account_info();
        let seeds = &[
            reward_mint.key.as_ref(),
            collection_name.as_ref(),
            b"state".as_ref(),
            &[bump_state],
        ];
        let signer = &[&seeds[..]];
        msg!("Reward Wallet: {:?}", reward_wallet.key());

        let rate_per_day: u64 = (state.rate_per_day as u64) * LPS;
        msg!("Rate Per Day x LAMPORTS_PER_SOL: {:?}", rate_per_day);
        let raw_rate_per_second = (rate_per_day / 86400) as f32;
        let rate_per_second: u64 = raw_rate_per_second.round() as u64;
        let staked_duration =
            (timestamp.unix_timestamp as u64) - (stake_status.last_stake_redeem as u64);
        // 86400;
        msg!("Seconds since last redeem: {}", staked_duration);
        let rewards_earned: u64 = rate_per_second * staked_duration;
        msg!("Rewards earned: {:?}", rewards_earned);
        msg!("User Reward ATA {:?}", user_reward_ata);
        let transfer_instruction = Transfer {
            from: reward_wallet.to_account_info(),
            to: ctx.accounts.user_reward_ata.to_account_info(),
            authority: state.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            transfer_instruction
        ).with_signer(signer);

        msg!("Start transfer");
        anchor_spl::token::transfer(cpi_ctx, rewards_earned)?;
        msg!("Successfully Transferred");

        Ok(())
    }

    pub fn unstake(ctx: Context<Unstake>) -> Result<()> {
        msg!("Unstake Program Invoked");
        // Get Clock
        if !ctx.accounts.stake_status.is_initialized {
            msg!("Account is not initialized");
            return err!(StakeError::UnintializedAccount);
        }

        if ctx.accounts.stake_status.stake_state != StakeState::Staked {
            msg!("Stake account is not staking anything");
            return err!(StakeError::InvalidStakeState);
        }

        // Thaw NFT Token Account

        msg!("Thawing NFT Token Account");
        let delegate_bump: u8 = *ctx.bumps.get("program_authority").unwrap();
        invoke_signed(
            &mpl_token_metadata::instruction::thaw_delegated_account(
                ctx.accounts.metadata_program.key(),
                ctx.accounts.program_authority.key(),
                ctx.accounts.nft_ata.key(),
                ctx.accounts.nft_edition.key(),
                ctx.accounts.nft_mint_address.key()
            ),
            &[
                ctx.accounts.program_authority.to_account_info(),
                ctx.accounts.nft_ata.to_account_info(),
                ctx.accounts.nft_edition.to_account_info(),
                ctx.accounts.nft_mint_address.to_account_info(),
                ctx.accounts.metadata_program.to_account_info(),
            ],
            &[&[b"authority", &[delegate_bump]]]
        )?;

        msg!("Revoking Delegation From NFT Account");
        let revoke_program_cpi: AccountInfo = ctx.accounts.token_program.to_account_info();
        let accounts_cpi: Revoke = Revoke {
            source: ctx.accounts.nft_ata.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let revoke_cpi_ctx: CpiContext<Revoke> = CpiContext::new(revoke_program_cpi, accounts_cpi);
        msg!("CPI Revoke Instructions On Token Program");
        token::revoke(revoke_cpi_ctx)?;

        ctx.accounts.stake_status.stake_state = StakeState::Unstaked;

        // Messages Confirming Information
        msg!("NFT ATA: {:?}", ctx.accounts.stake_status.user_nft_ata);
        msg!("User Pubkey: {:?}", ctx.accounts.stake_status.user_pubkey);
        msg!("Stake State: {:?}", ctx.accounts.stake_status.stake_state);
        msg!("Stake Start Time: {:?}", ctx.accounts.stake_status.stake_start_time);
        msg!("Time Since Last Redeem: {:?}", ctx.accounts.stake_status.last_stake_redeem);

        Ok(())
    }

    pub fn initialize_state_pda(
        _ctx: Context<InitializeStatePda>,
        _bump: u8,
        _rate: u32,
        _collection_name: String,
        _reward_symbol: String,
        _fire_eligible: bool
    ) -> Result<()> {
        msg!("Initializing state pda");
        msg!("Collection name: {}", _collection_name.as_str());
        msg!("Reward symbol: {}", _reward_symbol.as_str());
        msg!("State PDA: {}", _ctx.accounts.state_pda.key());
        msg!("Funder Address: {}", _ctx.accounts.funder.key());
        msg!("Token Prog Owned ATA: {}", _ctx.accounts.token_poa.key());
        msg!("Reward Token Mint: {}", _ctx.accounts.reward_mint.key());
        // if _ctx.accounts.state_pda.is_initialized {
        //     msg!("Account is already initialized");
        //     return err!(TokenStateError::AccountAlreadyInitialized);
        // }
        _ctx.accounts.state_pda.rate_per_day = _rate;
        _ctx.accounts.state_pda.bump = _bump;
        _ctx.accounts.state_pda.fire_eligible = _fire_eligible;
        _ctx.accounts.state_pda.collection_name = _collection_name;
        _ctx.accounts.state_pda.reward_symbol = _reward_symbol;
        _ctx.accounts.state_pda.manager = _ctx.accounts.funder.key();
        _ctx.accounts.state_pda.collection_address = _ctx.accounts.nft_collection_address.key();
        _ctx.accounts.state_pda.reward_wallet = _ctx.accounts.token_poa.key();
        _ctx.accounts.state_pda.is_initialized = true;
        Ok(())
    }
    /*NOT USED 
    pub fn initialize_token_pda(ctx: Context<InitializeTokenPda>, _bump1: u8) -> Result<()> {
        msg!("Initializing Token PDA");
        let pda = ctx.accounts.token_pda.key();
        msg!("token pda : {}", pda);

        ctx.accounts.state_pda.reward_wallet = pda;
        msg!("state pda reward_wallet: {}", ctx.accounts.state_pda.reward_wallet.key());
        Ok(())
    }
 NOT USED */
    pub fn deposit_to_reward_ata(
        ctx: Context<DepositToTokenPda>,
        _bump1: u8,
        _bump2: u8,
        _amount: u64
    ) -> Result<()> {
        msg!("Depositing to Token PDA: {}", ctx.accounts.state_pda.reward_wallet);
        msg!("Program Owned Ata Owner: {}");
        let state = &mut ctx.accounts.state_pda;
        msg!("{} Bump Before", state.bump);
        state.bump = _bump1;
        msg!("{} Bump After", state.bump);

        let bump_vector = _bump1.to_le_bytes();
        let sender = &ctx.accounts.funder;
        let reward_mint = &ctx.accounts.mint.to_account_info();
        let inner = vec![
            reward_mint.key.as_ref(),
            state.collection_name.as_ref(),
            b"state".as_ref(),
            bump_vector.as_ref()
        ];
        let outer = vec![inner.as_slice()];

        let transfer_instruction = Transfer {
            from: ctx.accounts.funder_ata.to_account_info(),
            to: ctx.accounts.token_poa.to_account_info(),
            authority: sender.to_account_info(),
        };

        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            transfer_instruction,
            outer.as_slice()
        );

        msg!("transfer call start");

        anchor_spl::token::transfer(cpi_ctx, _amount)?;
        ctx.accounts.token_poa.reload()?;
        msg!("Token pda key {}", ctx.accounts.token_poa.key());
        msg!("Token after transfer to receiver in PDA {}", ctx.accounts.token_poa.amount);

        msg!("Successfully Transferred");

        Ok(())
    }

    pub fn manager_withdrawal(
        ctx: Context<ManagerWithdrawal>,
        bump_state: u8,
        _close_ata: bool,
        collection_name: String,
        amount: u64
    ) -> Result<()> {
        msg!("State PDA: {}", ctx.accounts.state_pda.key());
        msg!("Manager: {}", ctx.accounts.manager.key());
        msg!("Manager ATA: {}", ctx.accounts.manager_ata.key());
        msg!("Program Owned Ata: {}", ctx.accounts.token_poa.key());
        msg!("Reward Token Mint: {}", ctx.accounts.reward_mint.key());
        if ctx.accounts.manager.key() != ctx.accounts.state_pda.manager {
            return Err(AdminError::IncorrectManagingAccount.into());
        }
        if ctx.accounts.token_poa.amount < amount {
            return Err(AdminError::NotEnoughFunds.into());
        }
        // let mut withdrawal_amount = amount;
        // if close_ata == true {
        //     msg!("Close Ata: {}", close_ata);
        //     withdrawal_amount = ctx.accounts.token_poa.amount;
        // }

        let reward_mint = &ctx.accounts.reward_mint.to_account_info();
        let seeds = &[
            reward_mint.key.as_ref(),
            collection_name.as_ref(),
            b"state".as_ref(),
            &[bump_state],
        ];
        let signer = &[&seeds[..]];
        let transfer_instruction = Transfer {
            from: ctx.accounts.token_poa.to_account_info().clone(),
            to: ctx.accounts.manager_ata.to_account_info().clone(),
            authority: ctx.accounts.state_pda.to_account_info().clone(),
        };

        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            transfer_instruction
        ).with_signer(signer);

        msg!("Start transfer");
        anchor_spl::token::transfer(cpi_ctx, amount)?;
        ctx.accounts.token_poa.reload()?;
        if ctx.accounts.token_poa.amount == 0 {
            msg!("Token Account Balance is Zero, Closing the Account");
            let close_ix = CloseAccount {
                account: ctx.accounts.token_poa.to_account_info().clone(),
                destination: ctx.accounts.manager_ata.to_account_info().clone(),
                authority: ctx.accounts.state_pda.to_account_info().clone(),
            };
            let close_ctx = CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                close_ix
            ).with_signer(signer);
            close_account(close_ctx)?;
            msg!("Token Account {} Closed", ctx.accounts.token_poa.key());
        } else {
            msg!("Token pda key {}", ctx.accounts.token_poa.key());
            msg!("Program Token Balance {}", ctx.accounts.token_poa.amount / 1000000000);
            msg!("Manager Token Balance {}", ctx.accounts.manager_ata.amount / 1000000000);

            msg!("Successfully Transferred");
        }
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(amount: u64, bump_state:u8, collection_name: String)]
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
        space = std::mem::size_of::<State>() + 8
    )]
    pub state_pda: Account<'info, State>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(Default)]
pub struct State {
    bump: u8,
    rate_per_day: u32,
    reward_wallet: Pubkey,
    reward_symbol: String,
    collection_name: String,
    collection_address: Pubkey,
    fire_eligible: bool,
    reward_mint: Pubkey,
    manager: Pubkey,
    is_initialized: bool,
}

#[derive(Accounts)]
#[instruction(_bump : u8 , _rate:u64, _reward_symbol: String, _collection_name: String, _fire_eligible: bool )]
pub struct InitializeStatePda<'info> {
    #[account(
        init_if_needed,
        payer = funder,
        seeds = [reward_mint.key().as_ref(), _collection_name.as_ref(), b"state".as_ref()],
        bump,
        space = std::mem::size_of::<State>() + 8
    )]
    pub state_pda: Account<'info, State>,
    /// CHECK: This is not dangerous because we don't read or write to this account.
    pub reward_mint: AccountInfo<'info>,
    pub token_poa: Account<'info, TokenAccount>,
    /// CHECK: This is not dangerous because we don't read or write to this account.
    pub nft_collection_address: AccountInfo<'info>,
    #[account(mut)]
    pub funder: Signer<'info>,
    #[account(mut)]
    pub funder_ata: Account<'info, TokenAccount>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DepositToTokenPda<'info> {
    #[account(
        mut,
        associated_token::authority = state_pda,
        associated_token::mint = mint,
    )]
    pub token_poa: Account<'info, TokenAccount>,
    pub state_pda: Account<'info, State>,
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
    pub stake_status: Account<'info, UserStakeInfo>,
    #[account(mut)]
    pub collection_reward_info: Account<'info, State>,
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
    #[account(mut)]
    pub user_reward_ata: Box<Account<'info, TokenAccount>>,
    // #[account(
    //     mut,
    //     associated_token::mint = nft_mint_address,
    //     associated_token::authority = user,)]
    // pub nft_ata: Account<'info, TokenAccount>,
    // pub nft_mint_address: Account<'info, Mint>,
    #[account(mut)]
    pub stake_status: Account<'info, UserStakeInfo>,
    #[account(mut)]
    pub reward_wallet: Box<Account<'info, TokenAccount>>,
    #[account(
        mut,
        seeds = [reward_mint.key.as_ref(), collection_name.as_ref(), b"state".as_ref()],
        bump,)]
    pub collection_reward_info: Account<'info, State>,
    /// CHECK: This is not dangerous because we don't read or write to this account.
    pub reward_mint: AccountInfo<'info>,
    // /// CHECK: Only using as a signing PDA
    // #[account(mut, seeds = [b"redeem_authority".as_ref()], bump)]
    // pub program_authority: AccountInfo<'info>,
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
    #[account(
        mut,
        seeds = [user.key().as_ref(), nft_ata.key().as_ref()],
        bump
    )]
    pub stake_status: Account<'info, UserStakeInfo>,
    /// CHECK: Only using as a signing PDA
    #[account(mut, seeds=[b"authority".as_ref()],bump)]
    pub program_authority: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
    /// CHECK: This is not dangerous because we don't read or write to this account.
    pub metadata_program: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

// pub struct UserRewardInfo {
//     pub reward_rate_per_day: u32,
//     pub reward_mint: Pubkey,
//     pub fire_eligible: bool,
// }
#[account]
#[derive(Default, PartialEq)]
pub struct UserStakeInfo {
    pub user_nft_ata: Pubkey,
    pub stake_start_time: i64,
    pub last_stake_redeem: i64,
    pub user_pubkey: Pubkey,
    pub stake_state: StakeState,
    pub collection_reward_state: Pubkey,
    pub is_initialized: bool,
    bump: u8,
}
// #[account]
// #[derive(Default, PartialEq)]
// pub struct UserRewardInfo {
//     pub user_reward_ata: Pubkey,
//     pub user_fire_ata: Pubkey,
//     pub fire_eligible: bool,
//     pub fire_rate_per_day: u64,
//     bump: u8,
// }

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

#[error_code]
pub enum RedeemError {
    #[msg("Not Eligible for FIRE Token")]
    NotFireEligible,
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