const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./books.db');

// создаём таблицу
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      author TEXT,
      description TEXT,
      image TEXT,
      categories TEXT
    )
  `);
});

module.exports = db;