// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use serde_json::json;
use std::fs::{self, File};
use std::io::{self, Write};
use std::path::Path;

const SETTINGS_PATH: &str = "./../settings.json";

#[tauri::command]
fn get_language() -> String {
    println!("Gettin language");
    if Path::new(SETTINGS_PATH).exists() {
        let settings = fs::read_to_string(SETTINGS_PATH).unwrap();
        let settings: serde_json::Value = serde_json::from_str(&settings).unwrap();
        settings["language"]
            .as_str()
            .map(|s| s.to_string())
            .unwrap_or("".to_string())
    } else {
        "".to_string()
    }
}

#[tauri::command]
fn save_language(language: &str) -> String {
    println!("Saving language: {}", language);
    print!("Saving language: {}", language);
    let mut settings = if Path::new(SETTINGS_PATH).exists() {
        serde_json::from_str(&fs::read_to_string(SETTINGS_PATH).unwrap()).unwrap()
    } else {
        json!({})
    };
    settings["language"] = json!(language);
    let settings = settings.to_string();
    let mut file = File::create(SETTINGS_PATH).unwrap();
    file.write_all(settings.as_bytes()).unwrap();
    "Language saved successfully".to_string()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![save_language, get_language])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
