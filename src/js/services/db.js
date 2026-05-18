const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

let db;

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) { if (err) reject(err); else resolve(this); });
  });
}
function all(sql, params = []) {
  return new Promise((resolve, reject) => db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows)));
}
function get(sql, params = []) {
  return new Promise((resolve, reject) => db.get(sql, params, (err, row) => err ? reject(err) : resolve(row)));
}

async function initDatabase(dbPath) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  db = new sqlite3.Database(dbPath);
  db.run('PRAGMA foreign_keys = ON');
  const schema = fs.readFileSync(path.join(__dirname, '../../main/db/schema.sql'), 'utf8');
  await new Promise((resolve, reject) => db.exec(schema, (err) => err ? reject(err) : resolve()));
}

const dbApi = {
  async getDashboard() {
    const total = await get('SELECT IFNULL(SUM(total_amount),0) as total FROM vouchers');
    const count = await get('SELECT COUNT(*) as count FROM vouchers');
    return { totalAmount: total.total, voucherCount: count.count };
  },
  async getNextPcvNo() {
    const yy = String(new Date().getFullYear()).slice(-2);
    const row = await get('SELECT pcv_no FROM vouchers WHERE pcv_no LIKE ? ORDER BY id DESC LIMIT 1', [`PCV # ${yy}%`]);
    const n = row ? Number(row.pcv_no.replace(`PCV # ${yy}`, '')) + 1 : 1;
    return `PCV # ${yy}${String(n).padStart(7, '0')}`;
  },
  listVouchers: (search = '') => all(`SELECT * FROM vouchers WHERE pcv_no LIKE ? OR paid_to LIKE ? OR remarks LIKE ? ORDER BY id DESC`, [`%${search}%`,`%${search}%`,`%${search}%`]),
  listAccountCodes: () => all('SELECT * FROM account_codes ORDER BY code'),
  saveVoucher: async (voucher, entries) => {
    const ins = await run('INSERT INTO vouchers (pcv_no,voucher_date,paid_to,remarks,total_amount,status,replenished) VALUES (?,?,?,?,?,?,0)', [voucher.pcv_no,voucher.voucher_date,voucher.paid_to,voucher.remarks,voucher.total_amount,'POSTED']);
    for (const e of entries) await run('INSERT INTO voucher_entries (voucher_id,account_code,description,debit,credit) VALUES (?,?,?,?,?)', [ins.lastID,e.account_code,e.description,e.debit,e.credit]);
    return ins.lastID;
  }
};

module.exports = { initDatabase, dbApi };
