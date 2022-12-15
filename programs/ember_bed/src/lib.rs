use anchor_lang::prelude::*;
use anchor_lang::solana_program::{ program::invoke_signed };
use anchor_spl::token;
use anchor_spl::{
    // associated_token::{ AssociatedToken, create },
    token::{ Approve, Revoke, Transfer, CloseAccount, close_account },
};

use crate::constants::{ LPS, FIRE_MINT, BASE_RATE, FIRE_COLLECTION_NAME, FIRE_SYMBOL };
use crate::structs::*;
use crate::errors::{ StakeError, AdminError, RedeemError };
use crate::state_and_relations::{ StakeState };
use crate::utils::*;
mod utils;
mod constants;
mod structs;
mod errors;
mod state_and_relations;
declare_id!("BW2w1qyVvgZyv6iNuYycWDnmNCMHoY8iA49BkHPzPi7Z");
// const LPS: u64 = 1_000_000_000;

#[program]
pub mod ember_bed {
    use super::*;
    pub fn stake(ctx: Context<Stake>) -> Result<()> {
        msg!("Stake Status: {:?}", ctx.accounts.stake_status.stake_state);
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

        ctx.accounts.stake_status.stake_start_time = timestamp.unix_timestamp;
        ctx.accounts.stake_status.last_stake_redeem = timestamp.unix_timestamp;

        // if !ctx.accounts.stake_status.is_initialized {
        // ctx.accounts.user_account_pda.user = ctx.accounts.user.key();
        ctx.accounts.stake_status.user_pubkey = ctx.accounts.user.key();
        ctx.accounts.stake_status.collection_reward_state =
            ctx.accounts.collection_reward_info.key();
        ctx.accounts.stake_status.user_nft_ata = ctx.accounts.nft_ata.key();
        ctx.accounts.stake_status.is_initialized = true;
        // }

        ctx.accounts.stake_status.stake_state = StakeState::Staked;
        // if ctx.accounts.stake_status.stake_state == StakeState::Staked {
        //     let pubkey = ctx.accounts.nft_mint_address.key();
        //     ctx.accounts.user_account_pda.
        //     let nft_pks = &mut ctx.accounts.user_account_pda.stake_status_pks;
        //     if !nft_pks.contains(&pubkey) {
        //         nft_pks.push(pubkey);
        //     }

        //     msg!("NFTs staked by user: {}", nft_pks.len());
        //     for item in nft_pks {
        //         msg!("{}", item);
        //     }
        // }
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
        msg!("Fire Token Mint: {:?}", FIRE_MINT);
        msg!("Collection Name: {:?}", ctx.accounts.collection_reward_info.collection_name);
        msg!("Collection Name Argument {:?}", collection_name);
        msg!("Stake is initialized: {:?}", ctx.accounts.stake_status.is_initialized);
        if !ctx.accounts.stake_status.is_initialized {
            msg!("Account is not initialized");
            return err!(StakeError::UnintializedAccount);
        }
        if ctx.accounts.stake_status.stake_state != StakeState::Staked {
            msg!("Stake account is not staking anything");
            return err!(StakeError::InvalidStakeState);
        }
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
        msg!("Rate per day: {:?}", state.rate_per_day);
        msg!("Rate Per Day x LAMPORTS_PER_SOL: {:?}", rate_per_day);

        let raw_rate_per_second = (rate_per_day / 86400) as f32;
        let rate_per_second: u64 = raw_rate_per_second.round() as u64;
        msg!(
            "Last Redeem: {:?} \n\n Now: {:?} \n\n Rate per second: {:?}, Raw rate_per_second: {:?}",
            stake_status.last_stake_redeem,
            timestamp.unix_timestamp,
            rate_per_second,
            raw_rate_per_second
        );
        let staked_duration = (timestamp.unix_timestamp - stake_status.last_stake_redeem) as u64;
        if timestamp.unix_timestamp == 0 || stake_status.last_stake_redeem == 0 {
            msg!("NFT Not Initialized Properly");
            ctx.accounts.stake_status.stake_state = StakeState::Unstaked;
            return Ok(());
        }
        // msg!("Seconds since last redeem: {}", staked_duration);
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
        ctx.accounts.stake_status.last_stake_redeem = timestamp.unix_timestamp;
        msg!("Last Redeem Set to {}", timestamp.unix_timestamp);
        Ok(())
    }

    pub fn unstake(ctx: Context<Unstake>) -> Result<()> {
        msg!("Unstake Program Invoked");
        // Get Clock
        // if !ctx.accounts.stake_status.is_initialized {
        //     msg!("Account is not initialized");
        //     return err!(StakeError::UnintializedAccount);
        // }

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
        // if ctx.accounts.stake_status.stake_state == StakeState::Unstaked {
        //     let pubkey = ctx.accounts.nft_mint_address.key();
        //     let mut nft_pks = ctx.accounts.user_account_pda.stake_status_pks.clone();
        //     nft_pks.retain(|item| item != &pubkey);
        //     msg!("NFTs staked by user: {}", nft_pks.len());
        //     for item in nft_pks {
        //         msg!("{}", item);
        //     }
        // }
        // Messages Confirming Information
        msg!("NFT ATA: {:?}", ctx.accounts.stake_status.user_nft_ata);
        msg!("User Pubkey: {:?}", ctx.accounts.stake_status.user_pubkey);
        msg!("Stake State: {:?}", ctx.accounts.stake_status.stake_state);
        msg!("Stake Start Time: {:?}", ctx.accounts.stake_status.stake_start_time);
        msg!("Time Since Last Redeem: {:?}", ctx.accounts.stake_status.last_stake_redeem);
        msg!("Stake Is Initialized: {:?}", ctx.accounts.stake_status.is_initialized);

        Ok(())
    }

    pub fn initialize_fire_pda(ctx: Context<InitializeFirePDA>, _bump: u8) -> Result<()> {
        msg!("Initializing fire pda");
        ctx.accounts.fire_pda.bump = _bump;
        ctx.accounts.fire_pda.collection_name = FIRE_COLLECTION_NAME.to_string();
        ctx.accounts.fire_pda.reward_symbol = FIRE_SYMBOL.to_string();
        ctx.accounts.fire_pda.manager = ctx.accounts.funder.key();
        ctx.accounts.fire_pda.reward_wallet = ctx.accounts.token_poa.key();
        ctx.accounts.fire_pda.is_initialized = true;

        msg!(
            "Successfully Initialized {} -- State: {}",
            ctx.accounts.fire_pda.key(),
            ctx.accounts.fire_pda.is_initialized
        );
        Ok(())
    }

    pub fn initialize_state_pda(
        _ctx: Context<InitializeStatePda>,
        _bump: u8,
        _rate: u32,
        _reward_symbol: String,
        _collection_name: String,
        _fire_eligible: bool,
        _phoenix_collection_relation: String
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
        msg!("Rate per day: {}", _ctx.accounts.state_pda.rate_per_day);
        _ctx.accounts.state_pda.fire_eligible = _fire_eligible;

        let pr = _phoenix_collection_relation.parse().unwrap();
        if _fire_eligible {
            _ctx.accounts.state_pda._phoenix_relation = pr;
        }
        _ctx.accounts.state_pda.reward_mint = _ctx.accounts.reward_mint.key();
        _ctx.accounts.state_pda.bump = _bump;
        _ctx.accounts.state_pda.collection_name = _collection_name.clone();
        _ctx.accounts.state_pda.reward_symbol = _reward_symbol;
        _ctx.accounts.state_pda.manager = _ctx.accounts.funder.key();
        _ctx.accounts.state_pda.collection_address = _ctx.accounts.nft_collection_address.key();
        _ctx.accounts.state_pda.reward_wallet = _ctx.accounts.token_poa.key();
        _ctx.accounts.state_pda.is_initialized = true;

        Ok(())
    }
    pub fn deposit_to_reward_ata(ctx: Context<DepositToTokenPda>, amount: u64) -> Result<()> {
        msg!("Depositing to Token PDA: {}", ctx.accounts.state_pda.reward_wallet);
        msg!("Program Owned Ata Owner: {}", ctx.accounts.token_poa.owner);
        let state = &mut ctx.accounts.state_pda;
        msg!("{} Bump After", state.bump);
        // let collection_name = &state.collection_name;
        let sender = &ctx.accounts.funder;
        // let reward_mint = &ctx.accounts.mint.to_account_info();

        let transfer_instruction = Transfer {
            from: ctx.accounts.funder_ata.to_account_info(),
            to: ctx.accounts.token_poa.to_account_info(),
            authority: sender.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            transfer_instruction
        );

        msg!("transfer call start");

        anchor_spl::token::transfer(cpi_ctx, amount)?;
        ctx.accounts.token_poa.reload()?;
        msg!("Token pda key {}", ctx.accounts.token_poa.key());
        msg!("Token after transfer to receiver in PDA {}", ctx.accounts.token_poa.amount);

        msg!("Successfully Transferred");

        Ok(())
    }

    pub fn deposit_to_fire_ata(ctx: Context<DepositToFirePda>, amount: u64) -> Result<()> {
        msg!("Depositing to Token PDA: {}", ctx.accounts.fire_pda.reward_wallet);
        msg!("Program Owned Ata Owner: {}", ctx.accounts.token_poa.owner);
        let state = &mut ctx.accounts.fire_pda;
        msg!("{}  Fire Bump After", state.bump);
        let collection_name = &state.collection_name;
        let sender = &ctx.accounts.funder;
        let reward_mint = &ctx.accounts.mint.to_account_info();
        msg!("FIRE MINT: {:?}", reward_mint.key());
        msg!("collection_name: {} ", collection_name);
        let transfer_instruction = Transfer {
            from: ctx.accounts.funder_ata.to_account_info(),
            to: ctx.accounts.token_poa.to_account_info(),
            authority: sender.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            transfer_instruction
        );

        msg!("transfer call start");

        anchor_spl::token::transfer(cpi_ctx, amount)?;
        ctx.accounts.token_poa.reload()?;
        msg!("Token pda key {}", ctx.accounts.token_poa.key());
        msg!("Token after transfer to receiver in PDA {}", ctx.accounts.token_poa.amount);

        msg!("Successfully Transferred");

        Ok(())
    }

    pub fn manager_withdrawal(
        ctx: Context<ManagerWithdrawal>,
        bump_state: u8,
        close_ata: bool,
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
        if close_ata == true {
            msg!("Close Ata: {}", close_ata);
            // withdrawal_amount = ctx.accounts.token_poa.amount;
        }

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

    pub fn redeem_fire(
        ctx: Context<RedeemFire>,
        // bump_state: u8,
        _bump_fire: u8,
        nfts_held: u8
    ) -> Result<()> {
        msg!("Redeeming for Fire Token {}", FIRE_MINT);
        msg!("Collection Name: {}", FIRE_COLLECTION_NAME);
        let _collection_info_pda = &ctx.accounts.collection_info;
        let fire_info = &ctx.accounts.fire_info;
        let stake_status = &ctx.accounts.stake_status;
        let user_reward_ata = &ctx.accounts.user_reward_ata;
        let timestamp = Clock::get().unwrap();
        let fire_poa = &ctx.accounts.fire_poa;
        // let fire_collection_name = &fire_info.collection_name;
        let fire_mint = get_fire_token();
        if !ctx.accounts.stake_status.is_initialized {
            msg!("Account is not initialized");
            return err!(StakeError::UnintializedAccount);
        }
        if ctx.accounts.stake_status.stake_state != StakeState::Staked {
            msg!("Stake account is not staking anything");
            return err!(StakeError::InvalidStakeState);
        }
        // Check if Collection is $Fire Eligble and return value
        let stored_relation = &ctx.accounts.collection_info._phoenix_relation;
        let mut relation_value = phoenix_relation_value(stored_relation);
        if relation_value == 0 {
            // Collection is NOT Eligible, checking if user is.
            msg!("Collection is not $Fire Eligible, Trying UserInfo");
            let holder_status = get_holder_status(nfts_held.into());
            relation_value = phoenix_user_relation_value(holder_status);
        }
        let relation = relation_value;

        msg!("Relation: {}", relation);
        if relation == 0 {
            msg!("User is not eligible");
            return Err(RedeemError::NotFireEligible.into());
        }

        let fire_rate: u64 = relation * (BASE_RATE as u64) * LPS;
        msg!("Rate Per Day x LAMPORTS_PER_SOL: {:?}", fire_rate);

        let raw_rate_per_second = (fire_rate / 86400) as f32;
        let rate_per_second: u64 = raw_rate_per_second.round() as u64;
        msg!(
            "Last Redeem: {:?} \n\n Now: {:?} \n\n Rate per second: {:?}, Raw rate_per_second: {:?}",
            stake_status.last_stake_redeem,
            timestamp.unix_timestamp,
            rate_per_second,
            raw_rate_per_second
        );
        let staked_duration = (timestamp.unix_timestamp - stake_status.last_stake_redeem) as u64;
        if timestamp.unix_timestamp == 0 || stake_status.last_stake_redeem == 0 {
            msg!("NFT Not Initialized Properly");
            ctx.accounts.stake_status.stake_state = StakeState::Unstaked;
            return Ok(());
        }

        let seeds = &[
            fire_mint.as_ref(),
            FIRE_COLLECTION_NAME.as_ref(),
            b"fstate".as_ref(),
            &[_bump_fire],
        ];
        let signer = &[&seeds[..]];

        // msg!("Seconds since last redeem: {}", staked_duration);
        let rewards_earned: u64 = rate_per_second * staked_duration;
        msg!("Rewards earned: {:?}", rewards_earned);
        msg!("User Reward ATA {:?}", ctx.accounts.user_reward_ata.key());
        let transfer_instruction = Transfer {
            from: fire_poa.to_account_info(),
            to: user_reward_ata.to_account_info(),
            authority: fire_info.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            transfer_instruction
        ).with_signer(signer);
        anchor_spl::token::transfer(cpi_ctx, rewards_earned)?;
        msg!("Successfully Transferred");
        ctx.accounts.stake_status.last_stake_redeem = timestamp.unix_timestamp;
        msg!("Last Redeem Set to {}", ctx.accounts.stake_status.last_stake_redeem);
        Ok(())
    }
}