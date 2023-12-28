use serde_json::json;
use std::fs::{self, File};
use std::io::Write;
use std::path::Path;
use bip39::{Language, Mnemonic, MnemonicType, Seed};
use solana_sdk::{
    account::from_account,
    clock::Clock,
    commitment_config::CommitmentConfig,
    native_token::lamports_to_sol,
    signature::{keypair_from_seed, 
        write_keypair_file, 
        Keypair},
    signer::Signer,
    sysvar,
};
use solana_program::{
    account_info::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
    rent::Rent,
    sysvar::Sysvar,
};
use bs58;

const SETTINGS_PATH: &str = "./../settings.json";

#[tauri::command]
pub fn get_balance() -> String {
    let settings = fs::read_to_string(SETTINGS_PATH).unwrap();
    let settings: serde_json::Value = serde_json::from_str(&settings).unwrap();

    let seed_base58 = settings["seed"].as_str().unwrap();

    let keypair = Keypair::from_base58_string(&seed_base58);

    let rpc_client = solana_client::rpc_client::RpcClient::new(
        "https://api.devnet.solana.com".to_string(),
    );

    let balance = rpc_client
        .get_balance(&keypair.pubkey())
        .expect("get_balance");
    lamports_to_sol(balance).to_string()
}