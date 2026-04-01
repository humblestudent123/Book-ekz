import { useState, useEffect } from 'react';
import { getBooks, addBook, deleteBook } from '../api/booksApi';

function BookList() {
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    const data = await getBooks();
    setBooks(data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (id) => {
    await deleteBook(id);
    fetchBooks(); // обновляем список после удаления
  };

  return (
    <div>
      <h2>Книги</h2>
      <ul>
        {books.map(book => (
          <li key={book.id}>
            {book.title} <button onClick={() => handleDelete(book.id)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BookList;