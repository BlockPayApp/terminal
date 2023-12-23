diesel::table! {
  invoices (invoice_id) {
    invoice_id -> BigInt,
    amount -> Float,
    address -> Text,
    price -> Float,
    currency -> Text,
    status -> Text,
    created_at -> BigInt,
    updated_at -> BigInt,
  }
}