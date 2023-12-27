diesel::table! {
  invoices (invoice_id) {
    invoice_id -> BigInt,
    #[derive(PartialEq, PartialOrd)]
    amount -> Float,
    address -> Text,
    price -> Float,
    currency -> Text,
    solpln -> Float,
    status -> Text,
    created_at -> BigInt,
    updated_at -> BigInt,
  }
}