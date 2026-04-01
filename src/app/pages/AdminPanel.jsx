import React, { useState, useEffect } from 'react';
import { addBook, getBooks, deleteBook } from '../../api/booksApi';

export default function AdminPanel({ onBookAdded }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genres, setGenres] = useState('');
  const [tags, setTags] = useState('');
  const [contentUrl, setContentUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [books, setBooks] = useState([]);
  const [searchId, setSearchId] = useState('');

  // Находим максимальный ID для новых книг
  const getNextId = () => {
    if (books.length === 0) return 1;
    return Math.max(...books.map(b => b.id || 0)) + 1;
  };

  // Загружаем книги при монтировании
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getBooks();
        const booksWithId = (data || []).map((b, idx) => ({
          ...b,
          id: b.id || idx + 1 // старым книгам даём числовой id
        }));
        setBooks(booksWithId);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBooks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const book = {
      id: getNextId(), // числовой уникальный id
      title,
      author,
      genres: genres ? genres.split(',').map(g => g.trim()) : [],
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      contentUrl
    };

    try {
      const newBook = await addBook(book);
      setBooks(prev => [...prev, newBook]);
      onBookAdded(newBook);
      setTitle(''); setAuthor(''); setGenres(''); setTags(''); setContentUrl('');
    } catch (err) {
      console.error(err);
      setError('Не удалось добавить книгу');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить книгу?')) return;
    try {
      await deleteBook(id);
      setBooks(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error(err);
      alert('Не удалось удалить книгу');
    }
  };

  // Фильтрация по id
  const filteredBooks = searchId
    ? books.filter(b => b.id.toString().includes(searchId))
    : books;

  return (
    <div>
      <h2>Добавить новую книгу</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Название" value={title} onChange={e => setTitle(e.target.value)} required />
        <input type="text" placeholder="Автор" value={author} onChange={e => setAuthor(e.target.value)} required />
        <input type="text" placeholder="Жанры через запятую" value={genres} onChange={e => setGenres(e.target.value)} />
        <input type="text" placeholder="Теги через запятую" value={tags} onChange={e => setTags(e.target.value)} />
        <input type="text" placeholder="books/имя книги" value={contentUrl} onChange={e => setContentUrl(e.target.value)} />
        <button type="submit" disabled={loading}>{loading ? 'Добавление...' : 'Добавить книгу'}</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2>Поиск по ID</h2>
      <input
        type="text"
        placeholder="Введите ID"
        value={searchId}
        onChange={e => setSearchId(e.target.value)}
      />

      <h2>Список книг</h2>
      <ul>
        {filteredBooks.map(book => (
          <li key={book.id} style={{ marginBottom: '8px' }}>
            <strong>{book.title}</strong> — {book.author} (ID: {book.id})
            <button 
              onClick={() => handleDelete(book.id)} 
              style={{ marginLeft: '10px', color: 'red' }}
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}