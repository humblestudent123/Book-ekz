// src/api/booksApi.js

const BASE_URL = 'http://localhost:3001/books';

/**
 * Получить все книги с API
 * @param {string} query
 */
export const fetchBooks = async (query = '') => {
  const res = await fetch(`${BASE_URL}?q=${query}`);
  const data = await res.json();

  // Адаптируем под UI: добавляем genres и tags
  return data.map(b => ({
    ...b,
    genres: b.categories || [],  // для фильтрации по жанрам
    tags: b.categories || []     // для поиска по тегам
  }));
};

/**
 * Добавить новую книгу через API
 * @param {Object} book - объект книги
 */
export const addBook = async (book) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book)
  });
  const data = await res.json();

  // Адаптация под UI
  return {
    ...data,
    genres: data.categories || [],
    tags: data.categories || []
  };
};