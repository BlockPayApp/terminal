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
use std::time::{SystemTime, UNIX_EPOCH};
use crate::establish_connection;
use crate::create_invoice;

const SETTINGS_PATH: &str = "./../settings.json";

#[tauri::command]
pub fn new_invoice(amount: i64) -> serde_json::Value {
    let settings = fs::read_to_string(SETTINGS_PATH).unwrap();
    let settings: serde_json::Value = serde_json::from_str(&settings).unwrap();

    // let seed_base58 = settings["seed"].as_str().unwrap();

    // let keypair = Keypair::from_base58_string(&seed_base58);

    // let rpc_client = solana_client::rpc_client::RpcClient::new(
    //     "http://localhost:8899".to_string(),
    // );

    let url = format!("https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT");
    let resp = reqwest::blocking::get(&url).unwrap().text().unwrap();
    let resp: serde_json::Value = serde_json::from_str(&resp).unwrap();

    let forex_url = format!("https://open.er-api.com/v6/latest/USD");
    let forex_resp = reqwest::blocking::get(&forex_url).unwrap().text().unwrap();
    let forex_resp: serde_json::Value = serde_json::from_str(&forex_resp).unwrap();

    let forex_rate_str = forex_resp["rates"]["PLN"].to_string();
    let forex_rate: f32 = forex_rate_str.parse().unwrap();

    let price_str = resp["price"].to_string();
    let price_str_rounded = &price_str[1..price_str.len()-5];

    println!("forex_rate_str: {}", forex_rate_str);
    println!("forex_rate: {}", forex_rate);
    println!("price_str: {}", price_str_rounded);

    let float_price: f32 = price_str_rounded.parse().unwrap();
    println!("5");

    println!("{}", float_price);
    let amount_float: f32 = (amount as f32)/100.0;
    let price = amount_float / (float_price * forex_rate);

    let solpln = float_price * forex_rate;

    let activation_id = settings["activation_id"].as_str().unwrap();
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs();

    let invoice_id = timestamp.to_string().chars().rev().take(5).collect::<String>();
    let address = settings["public_key"].as_str().unwrap();
    
    let invoice = json!({
        "invoice_id": activation_id.to_owned()+&invoice_id,
        "amount": amount,
        "address": address,
        "price": price,
        "solpln": solpln,
        "currency": "PLN",
        "status": "pending",
        "created_at": timestamp,
        "updated_at": timestamp
    });
    
    let connection = &mut establish_connection();
    let invoice_db = create_invoice(
        connection,
        &(activation_id.parse::<i64>().unwrap() + invoice_id.parse::<i64>().unwrap()), // converted to &i64
        &(amount as f32), // converted to &f32
        address, // converted to &str
        &(price as f32), // converted to &f32
        "PLN",
        &(solpln as f32), // converted to &f32
        "pending",
        &(timestamp as i64), // converted to &i64
        &(timestamp as i64), // converted to &i64
    );

    return invoice.into(); 
}