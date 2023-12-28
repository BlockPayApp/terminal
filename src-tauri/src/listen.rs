use diesel::{ExpressionMethods, QueryDsl, SelectableHelper};
use serde_json::json;
use solana_program::sysvar::instructions;
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
        Keypair, Signature},
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
use crate::models::*;
use crate::schema::invoices::dsl::*;
use diesel::prelude::*;
use std::time::Duration;
use std::thread;
use crate::schema::invoices::dsl::*;
use solana_transaction_status::{
  UiTransactionEncoding,
  EncodedTransaction, UiParsedMessage, UiMessage, UiInstruction, UiParsedInstruction};
use hex;

const SETTINGS_PATH: &str = "./../settings.json";

#[tauri::command]
pub fn listen(window: tauri::Window, memo: String) {
  let settings = fs::read_to_string(SETTINGS_PATH).unwrap();
  let settings: serde_json::Value = serde_json::from_str(&settings).unwrap();

  let seed_base58 = settings["seed"].as_str().unwrap();

  let keypair = Keypair::from_base58_string(&seed_base58);
  let public_key = keypair.pubkey();

  let rpc_client = solana_client::rpc_client::RpcClient::new(
      "https://api.devnet.solana.com".to_string(),
  );

  thread::spawn(move || {
    loop {
      let transaction_history = rpc_client.get_confirmed_signatures_for_address2(&public_key).unwrap();

      for transaction in transaction_history {
        println!("Coś dostałem");
        if (transaction.memo).is_some() {
          let memo_transac = transaction.memo.clone().expect("dwad").to_string();
          let memo_transac = &memo_transac[memo_transac.len()-10..memo_transac.len()];
          if (memo_transac == memo) {
            println!("Sig: {}", transaction.signature);

            // Zapnij pasy, niezłe gotowanie tutaj było
            let sig_bytes = bs58::decode(transaction.signature).into_vec().unwrap();
            let transac_sig = Signature::new(&sig_bytes);
            let transaction_by_sig = rpc_client.get_confirmed_transaction(&transac_sig, UiTransactionEncoding::JsonParsed).unwrap();

            match transaction_by_sig.transaction.transaction {
              EncodedTransaction::LegacyBinary(text) => {
                println!("Legacy: {}", text);
              },
              EncodedTransaction::Binary(_, _) => {
                println!("Binary variant encountered");
              },
              EncodedTransaction::Json(text) => {
                let message: UiMessage = text.message;
                match message {
                  UiMessage::Parsed(message_parsed) => {
                    let instructions = message_parsed.instructions;
                    let instruction = instructions[3].clone();
                    match instruction {
                      UiInstruction::Parsed(instruction_parsed) => {
                        println!("Parsed variant encountered");
                        match instruction_parsed {
                          UiParsedInstruction::Parsed(instruction) => {
                            println!("Parsed variant encountered");
                            let lamports = &instruction.parsed["info"]["lamports"];
                            let conn = &mut establish_connection();
                            
                            let memo_i64 = memo_transac.parse::<i64>().unwrap();

                            let invoice = invoices
                              .find(memo_i64)
                              .select(Invoice::as_select())
                              .first(conn)
                              .optional();

                            match invoice {
                              Ok(Some(invoice)) => {
                                let amount_db = invoice.amount;
                                let lamports_u64 = lamports.as_u64().unwrap();
                                let transac_sols = lamports_to_sol(lamports_u64) as f32;
                                if (amount_db < transac_sols) {
                                  window.emit("listen_got", "Wrong amount").unwrap();
                                  return;
                                }
                                diesel::update(invoices.find(memo_i64))
                                  .set(status.eq("completed"))
                                  .execute(conn)
                                  .expect("Error updating invoice");

                                window.emit("listen_got", "Completed").unwrap();
                                return;
                              },
                              Ok(None) => {
                                println!("Invoice not found");
                                window.emit("listen_got", "Invoice not found").unwrap();
                                return;
                              },
                              Err(_) => {
                                println!("Invoice not found");
                                window.emit("listen_got", "Invoice not found").unwrap();
                                return;
                              }
                            } 
                          },
                          UiParsedInstruction::PartiallyDecoded(_) => {
                            println!("Partial variant encountered");
                          },
                        }
                      },
                      UiInstruction::Compiled(_) => {
                        println!("Raw variant encountered");
                      },
                    }
                  },
                  UiMessage::Raw(_) => {
                    println!("Raw variant encountered");
                  },
                }
              },
              EncodedTransaction::Accounts(_) => {
                println!("Accounts variant encountered");
              },
            }
          }
        }
      }
      thread::sleep(Duration::from_secs(1));
    }
  });
}