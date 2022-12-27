export type EmberBed = {
  "version": "0.1.0",
  "name": "ember_bed",
  "instructions": [
    {
      "name": "stakingFee",
      "accounts": [
        {
          "name": "from",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "to",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "stake",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userRewardAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMintAddress",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftEdition",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakeStatus",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "type": "publicKey",
                "path": "user"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "nft_ata"
              }
            ]
          }
        },
        {
          "name": "collectionRewardInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programAuthority",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "authority"
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "collectionRewardPda",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "redeemReward",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userRewardAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeStatus",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionRewardInfo",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "type": "publicKey",
                "path": "reward_mint"
              },
              {
                "kind": "arg",
                "type": "string",
                "path": "collection_name"
              },
              {
                "kind": "const",
                "type": "string",
                "value": "state"
              }
            ]
          }
        },
        {
          "name": "rewardMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bumpState",
          "type": "u8"
        },
        {
          "name": "collectionName",
          "type": "string"
        }
      ]
    },
    {
      "name": "unstake",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMintAddress",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftEdition",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakeStatus",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programAuthority",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "authority"
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeFirePda",
      "accounts": [
        {
          "name": "firePda",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "type": "publicKey",
                "path": "reward_mint"
              },
              {
                "kind": "const",
                "type": "string",
                "value": "EmberBed"
              },
              {
                "kind": "const",
                "type": "string",
                "value": "fstate"
              }
            ]
          }
        },
        {
          "name": "rewardMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenPoa",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "funder",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "funderAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initializeStatePda",
      "accounts": [
        {
          "name": "statePda",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "type": "publicKey",
                "path": "reward_mint"
              },
              {
                "kind": "arg",
                "type": "string",
                "path": "_collection_name"
              },
              {
                "kind": "const",
                "type": "string",
                "value": "state"
              }
            ]
          }
        },
        {
          "name": "rewardMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenPoa",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftCollectionAddress",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "funder",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "funderAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        },
        {
          "name": "rate",
          "type": "u32"
        },
        {
          "name": "rewardSymbol",
          "type": "string"
        },
        {
          "name": "collectionName",
          "type": "string"
        },
        {
          "name": "fireEligible",
          "type": "bool"
        },
        {
          "name": "phoenixCollectionRelation",
          "type": "string"
        }
      ]
    },
    {
      "name": "updateStatePda",
      "accounts": [
        {
          "name": "statePda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenPoa",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftCollectionAddress",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "funder",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "funderAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        },
        {
          "name": "rate",
          "type": "u32"
        },
        {
          "name": "rewardSymbol",
          "type": "string"
        },
        {
          "name": "collectionName",
          "type": "string"
        },
        {
          "name": "fireEligible",
          "type": "bool"
        },
        {
          "name": "phoenixCollectionRelation",
          "type": "string"
        }
      ]
    },
    {
      "name": "depositToRewardAta",
      "accounts": [
        {
          "name": "tokenPoa",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "statePda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "funder",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "funderAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "depositToFireAta",
      "accounts": [
        {
          "name": "tokenPoa",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "firePda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "funder",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "funderAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "managerWithdrawal",
      "accounts": [
        {
          "name": "tokenPoa",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "manager",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "managerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "statePda",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "type": "publicKey",
                "path": "reward_mint"
              },
              {
                "kind": "arg",
                "type": "string",
                "path": "collection_name"
              },
              {
                "kind": "const",
                "type": "string",
                "value": "state"
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bumpState",
          "type": "u8"
        },
        {
          "name": "closeAta",
          "type": "bool"
        },
        {
          "name": "collectionName",
          "type": "string"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "redeemFire",
      "accounts": [
        {
          "name": "firePoa",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userRewardAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeStatus",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fireMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fireInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bumpFire",
          "type": "u8"
        },
        {
          "name": "nftsHeld",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "userStakeInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "userNftAta",
            "type": "publicKey"
          },
          {
            "name": "stakeStartTime",
            "type": "i64"
          },
          {
            "name": "lastStakeRedeem",
            "type": "i64"
          },
          {
            "name": "userPubkey",
            "type": "publicKey"
          },
          {
            "name": "stakeState",
            "type": {
              "defined": "StakeState"
            }
          },
          {
            "name": "phoenixStatus",
            "type": {
              "defined": "PhoenixUserRelation"
            }
          },
          {
            "name": "collectionRewardState",
            "type": "publicKey"
          },
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "collectionRewardInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "ratePerDay",
            "type": "u32"
          },
          {
            "name": "rewardWallet",
            "type": "publicKey"
          },
          {
            "name": "rewardSymbol",
            "type": "string"
          },
          {
            "name": "collectionName",
            "type": "string"
          },
          {
            "name": "collectionAddress",
            "type": "publicKey"
          },
          {
            "name": "fireEligible",
            "type": "bool"
          },
          {
            "name": "phoenixRelation",
            "type": {
              "defined": "PhoenixRelation"
            }
          },
          {
            "name": "rewardMint",
            "type": "publicKey"
          },
          {
            "name": "manager",
            "type": "publicKey"
          },
          {
            "name": "isInitialized",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "fireRewardInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "rewardWallet",
            "type": "publicKey"
          },
          {
            "name": "rewardSymbol",
            "type": "string"
          },
          {
            "name": "collectionName",
            "type": "string"
          },
          {
            "name": "rewardMint",
            "type": "publicKey"
          },
          {
            "name": "manager",
            "type": "publicKey"
          },
          {
            "name": "isInitialized",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "userAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "stakeStatusPks",
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "StakeError",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "AccountAlreadyInitialized"
          },
          {
            "name": "UnintializedAccount"
          },
          {
            "name": "InvalidStakeState"
          }
        ]
      }
    },
    {
      "name": "TokenStateError",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "AccountAlreadyInitialized"
          },
          {
            "name": "UnintializedAccount"
          }
        ]
      }
    },
    {
      "name": "AdminError",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "IncorrectManagingAccount"
          },
          {
            "name": "NotEnoughFunds"
          },
          {
            "name": "NoAccountFound"
          },
          {
            "name": "GeneralError"
          },
          {
            "name": "InvalidSeeds"
          }
        ]
      }
    },
    {
      "name": "GenErrors",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "InvalidCreatorPubkey"
          },
          {
            "name": "InvalidPubkey"
          },
          {
            "name": "AtaAmountIsNotOne"
          },
          {
            "name": "MintAndAtaMismatch"
          },
          {
            "name": "UserDoesNotOwnMint"
          },
          {
            "name": "TokenPDAMismatch"
          },
          {
            "name": "AvatarNotInCollection"
          },
          {
            "name": "CreatorInvalid"
          }
        ]
      }
    },
    {
      "name": "StakeState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Staked"
          },
          {
            "name": "Unstaked"
          }
        ]
      }
    },
    {
      "name": "PhoenixRelation",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Affiliate"
          },
          {
            "name": "Saved"
          },
          {
            "name": "Founder"
          },
          {
            "name": "Member"
          },
          {
            "name": "EmberBed"
          },
          {
            "name": "None"
          }
        ]
      }
    },
    {
      "name": "PhoenixUserRelation",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Hobby"
          },
          {
            "name": "Loyal"
          },
          {
            "name": "DieHard"
          },
          {
            "name": "Whale"
          },
          {
            "name": "None"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NotFireEligible",
      "msg": "Not Eligible for FIRE Token"
    }
  ]
};

export const IDL: EmberBed = {
  "version": "0.1.0",
  "name": "ember_bed",
  "instructions": [
    {
      "name": "stakingFee",
      "accounts": [
        {
          "name": "from",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "to",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "stake",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userRewardAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMintAddress",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftEdition",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakeStatus",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "type": "publicKey",
                "path": "user"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "nft_ata"
              }
            ]
          }
        },
        {
          "name": "collectionRewardInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programAuthority",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "authority"
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "collectionRewardPda",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "redeemReward",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userRewardAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeStatus",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionRewardInfo",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "type": "publicKey",
                "path": "reward_mint"
              },
              {
                "kind": "arg",
                "type": "string",
                "path": "collection_name"
              },
              {
                "kind": "const",
                "type": "string",
                "value": "state"
              }
            ]
          }
        },
        {
          "name": "rewardMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bumpState",
          "type": "u8"
        },
        {
          "name": "collectionName",
          "type": "string"
        }
      ]
    },
    {
      "name": "unstake",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMintAddress",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftEdition",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakeStatus",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programAuthority",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "authority"
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeFirePda",
      "accounts": [
        {
          "name": "firePda",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "type": "publicKey",
                "path": "reward_mint"
              },
              {
                "kind": "const",
                "type": "string",
                "value": "EmberBed"
              },
              {
                "kind": "const",
                "type": "string",
                "value": "fstate"
              }
            ]
          }
        },
        {
          "name": "rewardMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenPoa",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "funder",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "funderAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initializeStatePda",
      "accounts": [
        {
          "name": "statePda",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "type": "publicKey",
                "path": "reward_mint"
              },
              {
                "kind": "arg",
                "type": "string",
                "path": "_collection_name"
              },
              {
                "kind": "const",
                "type": "string",
                "value": "state"
              }
            ]
          }
        },
        {
          "name": "rewardMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenPoa",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftCollectionAddress",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "funder",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "funderAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        },
        {
          "name": "rate",
          "type": "u32"
        },
        {
          "name": "rewardSymbol",
          "type": "string"
        },
        {
          "name": "collectionName",
          "type": "string"
        },
        {
          "name": "fireEligible",
          "type": "bool"
        },
        {
          "name": "phoenixCollectionRelation",
          "type": "string"
        }
      ]
    },
    {
      "name": "updateStatePda",
      "accounts": [
        {
          "name": "statePda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenPoa",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftCollectionAddress",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "funder",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "funderAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        },
        {
          "name": "rate",
          "type": "u32"
        },
        {
          "name": "rewardSymbol",
          "type": "string"
        },
        {
          "name": "collectionName",
          "type": "string"
        },
        {
          "name": "fireEligible",
          "type": "bool"
        },
        {
          "name": "phoenixCollectionRelation",
          "type": "string"
        }
      ]
    },
    {
      "name": "depositToRewardAta",
      "accounts": [
        {
          "name": "tokenPoa",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "statePda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "funder",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "funderAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "depositToFireAta",
      "accounts": [
        {
          "name": "tokenPoa",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "firePda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "funder",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "funderAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "managerWithdrawal",
      "accounts": [
        {
          "name": "tokenPoa",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "manager",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "managerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "statePda",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "type": "publicKey",
                "path": "reward_mint"
              },
              {
                "kind": "arg",
                "type": "string",
                "path": "collection_name"
              },
              {
                "kind": "const",
                "type": "string",
                "value": "state"
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bumpState",
          "type": "u8"
        },
        {
          "name": "closeAta",
          "type": "bool"
        },
        {
          "name": "collectionName",
          "type": "string"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "redeemFire",
      "accounts": [
        {
          "name": "firePoa",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userRewardAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeStatus",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fireMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fireInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bumpFire",
          "type": "u8"
        },
        {
          "name": "nftsHeld",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "userStakeInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "userNftAta",
            "type": "publicKey"
          },
          {
            "name": "stakeStartTime",
            "type": "i64"
          },
          {
            "name": "lastStakeRedeem",
            "type": "i64"
          },
          {
            "name": "userPubkey",
            "type": "publicKey"
          },
          {
            "name": "stakeState",
            "type": {
              "defined": "StakeState"
            }
          },
          {
            "name": "phoenixStatus",
            "type": {
              "defined": "PhoenixUserRelation"
            }
          },
          {
            "name": "collectionRewardState",
            "type": "publicKey"
          },
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "collectionRewardInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "ratePerDay",
            "type": "u32"
          },
          {
            "name": "rewardWallet",
            "type": "publicKey"
          },
          {
            "name": "rewardSymbol",
            "type": "string"
          },
          {
            "name": "collectionName",
            "type": "string"
          },
          {
            "name": "collectionAddress",
            "type": "publicKey"
          },
          {
            "name": "fireEligible",
            "type": "bool"
          },
          {
            "name": "phoenixRelation",
            "type": {
              "defined": "PhoenixRelation"
            }
          },
          {
            "name": "rewardMint",
            "type": "publicKey"
          },
          {
            "name": "manager",
            "type": "publicKey"
          },
          {
            "name": "isInitialized",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "fireRewardInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "rewardWallet",
            "type": "publicKey"
          },
          {
            "name": "rewardSymbol",
            "type": "string"
          },
          {
            "name": "collectionName",
            "type": "string"
          },
          {
            "name": "rewardMint",
            "type": "publicKey"
          },
          {
            "name": "manager",
            "type": "publicKey"
          },
          {
            "name": "isInitialized",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "userAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "stakeStatusPks",
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "StakeError",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "AccountAlreadyInitialized"
          },
          {
            "name": "UnintializedAccount"
          },
          {
            "name": "InvalidStakeState"
          }
        ]
      }
    },
    {
      "name": "TokenStateError",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "AccountAlreadyInitialized"
          },
          {
            "name": "UnintializedAccount"
          }
        ]
      }
    },
    {
      "name": "AdminError",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "IncorrectManagingAccount"
          },
          {
            "name": "NotEnoughFunds"
          },
          {
            "name": "NoAccountFound"
          },
          {
            "name": "GeneralError"
          },
          {
            "name": "InvalidSeeds"
          }
        ]
      }
    },
    {
      "name": "GenErrors",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "InvalidCreatorPubkey"
          },
          {
            "name": "InvalidPubkey"
          },
          {
            "name": "AtaAmountIsNotOne"
          },
          {
            "name": "MintAndAtaMismatch"
          },
          {
            "name": "UserDoesNotOwnMint"
          },
          {
            "name": "TokenPDAMismatch"
          },
          {
            "name": "AvatarNotInCollection"
          },
          {
            "name": "CreatorInvalid"
          }
        ]
      }
    },
    {
      "name": "StakeState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Staked"
          },
          {
            "name": "Unstaked"
          }
        ]
      }
    },
    {
      "name": "PhoenixRelation",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Affiliate"
          },
          {
            "name": "Saved"
          },
          {
            "name": "Founder"
          },
          {
            "name": "Member"
          },
          {
            "name": "EmberBed"
          },
          {
            "name": "None"
          }
        ]
      }
    },
    {
      "name": "PhoenixUserRelation",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Hobby"
          },
          {
            "name": "Loyal"
          },
          {
            "name": "DieHard"
          },
          {
            "name": "Whale"
          },
          {
            "name": "None"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NotFireEligible",
      "msg": "Not Eligible for FIRE Token"
    }
  ]
};
