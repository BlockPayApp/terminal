use diesel::prelude::*;
use crate::schema::invoices;

#[derive(Queryable, Selectable)]
#[diesel(table_name = crate::schema::invoices)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Invoice {
  pub invoice_id: i64,
  pub amount: f32,
  pub address: String,
  pub price: f32,
  pub currency: String,
  pub solpln: f32,
  pub status: String,
  pub created_at: i64,
  pub updated_at: i64,
}

#[derive(Insertable)]
#[diesel(table_name = invoices)]
pub struct NewInvoice<'a> {
  pub invoice_id: &'a i64,
  pub amount: &'a f32,
  pub address: &'a str,
  pub price: &'a f32,
  pub currency: &'a str,
  pub solpln: &'a f32,
  pub status: &'a str,
  pub created_at: &'a i64,
  pub updated_at: &'a i64,
}
