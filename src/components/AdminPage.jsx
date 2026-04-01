import { useState, useEffect } from 'react';
import BookList from './BookList';
import AdminAddBook from './AdminPage';
import { getBooks, addBook, deleteBook } from '../api/booksApi';

function AdminPage() {
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    const data = await getBooks();
    setBooks(data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div>
      <h1>Админка</h1>

      {/* Форма добавления книги */}
      <AdminAddBook onAdd={fetchBooks} />

      {/* Список книг с кнопками удаления */}
      <BookList books={books} onUpdate={fetchBooks} />
    </div>
  );
}

export default AdminPage;