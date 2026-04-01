import React, { useState } from 'react';
import { addBook } from '../../api/booksApi';

export default function AdminPanel({ onBookAdded }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genres, setGenres] = useState('');
  const [tags, setTags] = useState('');
  const [contentUrl, setContentUrl] = useState(''); // <-- теперь можно вводить URL
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const book = {
      title,
      author,
      genres: genres ? genres.split(',').map(g => g.trim()) : [],
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      contentUrl
    };

    console.log('Отправляем на сервер:', book);

    try {
      const newBook = await addBook(book);
      onBookAdded(newBook); // обновляем состояние в App.jsx
      setTitle('');
      setAuthor('');
      setGenres('');
      setTags('');
      setContentUrl(''); // очищаем поле после добавления
    } catch (err) {
      console.error('Ошибка добавления книги:', err.response?.data || err.message);
      setError('Не удалось добавить книгу');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Добавить новую книгу</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Название"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Автор"
          value={author}
          onChange={e => setAuthor(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Жанры через запятую"
          value={genres}
          onChange={e => setGenres(e.target.value)}
        />
        <input
          type="text"
          placeholder="Теги через запятую"
          value={tags}
          onChange={e => setTags(e.target.value)}
        />
        <input
          type="text"
          placeholder="URL контента книги"
          value={contentUrl}
          onChange={e => setContentUrl(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Добавление...' : 'Добавить книгу'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}