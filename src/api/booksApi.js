const BASE_URL = 'http://localhost:3001/books';

export const fetchBooks = async (query = '') => {
  const res = await fetch(`${BASE_URL}?q=${query}`);
  return res.json();
};