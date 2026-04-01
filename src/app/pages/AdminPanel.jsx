// src/pages/AdminPanel.jsx
import React, { useState } from 'react';
import { fetchBooks, addBook } from '../../api/booksApi';

export default function AdminPanel({ onBookAdded }) {
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    description: '',
    image: '',
    categories: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBook(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoriesChange = (e) => {
    const value = e.target.value;
    setNewBook(prev => ({ ...prev, categories: value.split(',').map(c => c.trim()) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newBook.title) return alert('Введите название книги');
    try {
      const added = await addBook(newBook);
      onBookAdded(added); // уведомляем родителя, чтобы добавить книгу в список
      setNewBook({ title: '', author: '', description: '', image: '', categories: [] });
      alert('Книга добавлена!');
    } catch (err) {
      console.error('Ошибка при добавлении книги', err);
    }
  };

  return (
    <div className="admin-panel">
      <h2>Админ-панель — добавить книгу</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Название" value={newBook.title} onChange={handleChange} required />
        <input type="text" name="author" placeholder="Автор" value={newBook.author} onChange={handleChange} />
        <input type="text" name="description" placeholder="Описание" value={newBook.description} onChange={handleChange} />
        <input type="text" name="image" placeholder="URL обложки" value={newBook.image} onChange={handleChange} />
        <input type="text" name="categories" placeholder="Категории (через запятую)" value={newBook.categories.join(', ')} onChange={handleCategoriesChange} />
        <button type="submit">Добавить книгу</button>
      </form>
    </div>
  );
}