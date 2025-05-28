const Database = require('better-sqlite3');
const outputDb = new Database('outputs.db');
const peopleDb = new Database('outputs.db');
const periodsDb = new Database('outputs.db');

outputDb.prepare(`
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
    weekOfTheYear NUMBER,
    date DATE
  )
`).run();

peopleDb.prepare(`
  CREATE TABLE IF NOT EXISTS people (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    availability INT NOT NULL
  )
`).run();

periodsDb.prepare(`
  CREATE TABLE IF NOT EXISTS periods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    startWeek INT,
    endWeek INT
  )
`).run();

module.exports = outputDb, peopleDb;
