const Database = require('better-sqlite3');
const db = new Database('outputs.db');

db.prepare(`
  CREATE TABLE IF NOT EXISTS outputs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    availability INT NOT NULL,
    newOpps INT NOT NULL,
    currentChances INT NOT NULL,
    details TEXT NOT NULL,
    projectStarts INT NOT NULL,
    newEntries INT NOT NULL,
    contracts INT NOT NULL,
    kvts INT NOT NULL,
    note TEXT NOT NULL,
    weekOfTheYear NUMBER
  )
`).run();

module.exports = db;
