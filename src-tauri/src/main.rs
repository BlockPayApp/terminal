// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::env;
use terminal::language::{save_language, get_language};
use terminal::{__cmd__save_language, __cmd__get_language};

use terminal::passphrase::{save_passphrase, get_public_key};
use terminal::{__cmd__save_passphrase, __cmd__get_public_key};

use terminal::balance::{get_balance};
use terminal::{__cmd__get_balance};

use terminal::invoice::{new_invoice};
use terminal::{__cmd__new_invoice};

use terminal::power_on::{power_on};
use terminal::{__cmd__power_on};


fn main() {
    env::set_var("RUST_BACKTRACE", "full");
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![save_language, 
            get_language,
            save_passphrase,
            get_public_key,
            get_balance,
            new_invoice,
            power_on,])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
