import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(express.json());

const BOOKS_PATH = './books.json';

// Получить все книги
app.get('/books', (req, res) => {
  const books = JSON.parse(fs.readFileSync(BOOKS_PATH));
  res.json(books);
});

// Добавить книгу
app.post('/books', (req, res) => {
  const books = JSON.parse(fs.readFileSync(BOOKS_PATH));
  const newBook = { id: Date.now(), ...req.body };
  books.push(newBook);
  fs.writeFileSync(BOOKS_PATH, JSON.stringify(books, null, 2));
  res.status(201).json(newBook);
});

// Удалить книгу
app.delete('/books/:id', (req, res) => {
  let books = JSON.parse(fs.readFileSync(BOOKS_PATH));
  books = books.filter(b => b.id != req.params.id);
  fs.writeFileSync(BOOKS_PATH, JSON.stringify(books, null, 2));
  res.json({ success: true });
});

app.listen(5000, () => console.log('⚡ Backend running on http://localhost:5000')); 