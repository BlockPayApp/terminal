use serde_json::json;
use std::fs::{self, File};
use std::io::Write;
use std::path::Path;
use std::time::{SystemTime, UNIX_EPOCH};

const SETTINGS_PATH: &str = "./../settings.json";

#[tauri::command]
pub fn power_on() {
  let settings = fs::read_to_string(SETTINGS_PATH).unwrap();
  let mut settings: serde_json::Value = serde_json::from_str(&settings).unwrap();

  if settings["activation_id"].as_str().is_none() {
    let timestamp = SystemTime::now()
      .duration_since(UNIX_EPOCH)
      .unwrap()
      .as_secs();

    let activation_id = timestamp.to_string().chars().rev().take(5).collect::<String>();

    settings["activation_id"] = json!(activation_id);
    let settings = settings.to_string();
    let mut file = File::create(SETTINGS_PATH).unwrap();
    file.write_all(settings.as_bytes()).unwrap();
  }
}