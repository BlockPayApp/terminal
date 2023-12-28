use serde_json::json;
use std::fs::{self, File};
use std::io::Write;
use std::path::Path;

const SETTINGS_PATH: &str = "./../settings.json";

#[tauri::command]
pub fn get_language() -> String {
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
pub fn save_language(language: &str) -> String {
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
