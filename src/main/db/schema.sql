CREATE TABLE IF NOT EXISTS vouchers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pcv_no TEXT UNIQUE NOT NULL,
  voucher_date TEXT NOT NULL,
  paid_to TEXT NOT NULL,
  remarks TEXT,
  total_amount REAL NOT NULL DEFAULT 0,
  amount_in_words TEXT,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  replenished INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS voucher_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  voucher_id INTEGER NOT NULL,
  account_code TEXT NOT NULL,
  description TEXT NOT NULL,
  debit REAL NOT NULL DEFAULT 0,
  credit REAL NOT NULL DEFAULT 0,
  FOREIGN KEY (voucher_id) REFERENCES vouchers(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS account_codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS signatories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  position_title TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS replenishments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  replenishment_no TEXT UNIQUE NOT NULL,
  replenishment_date TEXT NOT NULL,
  fund_amount REAL NOT NULL,
  used_amount REAL NOT NULL,
  usage_percent REAL NOT NULL,
  remarks TEXT
);
CREATE TABLE IF NOT EXISTS replenishment_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  replenishment_id INTEGER NOT NULL,
  voucher_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  FOREIGN KEY (replenishment_id) REFERENCES replenishments(id) ON DELETE CASCADE,
  FOREIGN KEY (voucher_id) REFERENCES vouchers(id)
);
