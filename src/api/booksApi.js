/* Получить все книги */
app.get('/books', async (req, res) => {
  try {
    const books = await pool.query('SELECT * FROM books');
    res.json(books.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

/* Получить книгу по id */
app.get('/books/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const book = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    if (!book.rows.length) return res.status(404).json({ error: 'Книга не найдена' });
    res.json(book.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}); 