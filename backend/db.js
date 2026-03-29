const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.sqlite');

// создаём таблицу если нет
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS quotes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bookId TEXT,
      text TEXT,
      date TEXT,
      page INTEGER
    )
  `);
});

module.exports = db;