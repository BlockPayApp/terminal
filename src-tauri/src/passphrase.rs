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
pub fn get_public_key() -> String {
    if Path::new(SETTINGS_PATH).exists() {
        let settings = fs::read_to_string(SETTINGS_PATH).unwrap();
        let settings: serde_json::Value = serde_json::from_str(&settings).unwrap();
        settings["public_key"]
            .as_str()
            .map(|s| s.to_string())
            .unwrap_or("".to_string())
    } else {
        "".to_string()
    }
}

#[tauri::command]
pub fn save_passphrase(passphrase: &str) {
    let mnemonic = Mnemonic::from_phrase(passphrase, Language::English).unwrap();

    let seed = Seed::new(&mnemonic, "");

    let mut settings = if Path::new(SETTINGS_PATH).exists() {
        serde_json::from_str(&fs::read_to_string(SETTINGS_PATH).unwrap()).unwrap()
    } else {
        json!({})
    };

    let keypair = keypair_from_seed(seed.as_bytes()).unwrap();
    println!("Mnemonic: {:?}", mnemonic);
    println!("Public key: {}", &keypair.pubkey());

    settings["seed"] = json!(keypair.to_base58_string());
    settings["public_key"] = json!(keypair_from_seed(seed.as_bytes()).unwrap().pubkey().to_string());
    let settings = settings.to_string();
    let mut file = File::create(SETTINGS_PATH).unwrap();
    file.write_all(settings.as_bytes()).unwrap();

    let rpc_client = solana_client::rpc_client::RpcClient::new(
        "http://localhost:8899".to_string(),
    );
    let balance = rpc_client
        .get_balance(&keypair.pubkey())
        .expect("get_balance");
    println!("Balance: {} SOL", lamports_to_sol(balance));

    let to_address = "7nnaPYYRwnNrEHi17LgVxLUJp59eYsdJeL3wLNDdHhnL";
    let to_pubkey = to_address.parse::<Pubkey>().unwrap();

    let mut transaction = solana_sdk::transaction::Transaction::new_with_payer(
        &[solana_program::system_instruction::transfer(
            &keypair.pubkey(),
            &to_pubkey,
            1_000_000_000, // 1 SOL in lamports
        )],
        Some(&keypair.pubkey()),
    );

    let (recent_blockhash, _fee_calculator) = rpc_client.get_recent_blockhash().unwrap();
    transaction.sign(&[&keypair], recent_blockhash);

    let result = rpc_client.send_and_confirm_transaction_with_spinner(&transaction);

    match result {
        Ok(_) => println!("Transaction succeeded"),
        Err(err) => eprintln!("Transaction failed: {:?}", err),
    }

    let balance = rpc_client
        .get_balance(&keypair.pubkey())
        .expect("get_balance");
    println!("Balance: {} SOL", lamports_to_sol(balance));

}