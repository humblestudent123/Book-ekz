const db = require('../db/database');

// GET /books?q=react
exports.getBooks = (req, res) => {
  const { q } = req.query;

  let sql = 'SELECT * FROM books';
  let params = [];

  if (q) {
    sql += ' WHERE title LIKE ?';
    params.push(`%${q}%`);
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // парсим categories обратно в массив
    const books = rows.map(b => ({
      ...b,
      categories: JSON.parse(b.categories || '[]')
    }));

    res.json(books);
  });
};

// POST /books
exports.createBook = (req, res) => {
  const { title, author, description, image, categories } = req.body;

  const sql = `
    INSERT INTO books (title, author, description, image, categories)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
      title,
      author,
      description,
      image,
      JSON.stringify(categories || [])
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({ id: this.lastID });
    }
  );
};