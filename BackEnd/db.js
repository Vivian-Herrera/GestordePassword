const path = require('path');
const Database = require('better-sqlite3');
const db = new Database(path.resolve(__dirname, 'passwords.db'));

db.prepare(`
  CREATE TABLE IF NOT EXISTS passwords (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    username TEXT,
    password TEXT NOT NULL
  )
`).run();

module.exports = db;


