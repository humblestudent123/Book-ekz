const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

/* 🔹 Получить все цитаты книги */
app.get('/quotes/:bookId', (req, res) => {
  const { bookId } = req.params;

  db.all(
    'SELECT * FROM quotes WHERE bookId = ?',
    [bookId],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});

/* 🔹 Добавить цитату */
app.post('/quotes', (req, res) => {
  const { bookId, text, date, page } = req.body;

  db.run(
    'INSERT INTO quotes (bookId, text, date, page) VALUES (?, ?, ?, ?)',
    [bookId, text, date, page],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID });
    }
  );
});

/* 🔹 Удалить цитату */
app.delete('/quotes/:id', (req, res) => {
  db.run(
    'DELETE FROM quotes WHERE id = ?',
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    }
  );
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});