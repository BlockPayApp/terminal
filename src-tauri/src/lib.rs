#![allow(warnings)]
pub mod schema;
pub mod models;

pub mod language;
pub mod passphrase;
pub mod balance;
pub mod invoice;
pub mod power_on;

use diesel::sqlite::SqliteConnection;
use diesel::prelude::*;

const DATABASE_URL: &str ="./../db.sqlite";

pub fn establish_connection() -> SqliteConnection {
  SqliteConnection::establish(&DATABASE_URL)
     .unwrap_or_else(|_| panic!("Error connecting to {}", DATABASE_URL))
}

use self::models::{NewInvoice, Invoice};

pub fn create_invoice(conn: &mut SqliteConnection, 
  invoice_id: &i64, 
  amount: &f32, 
  address: &str, 
  price: &f32, 
  currency: &str, 
  status: &str, 
  created_at: &i64, 
  updated_at: &i64) {
  use schema::invoices;

  let new_invoice = NewInvoice {
    invoice_id,
    amount,
    address,
    price,
    currency,
    status,
    created_at,
    updated_at,
  };

  diesel::insert_into(invoices::table)
    .values(&new_invoice)
    .execute(conn)
    .expect("Error saving new invoice");

}