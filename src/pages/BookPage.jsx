import { useParams, useNavigate } from 'react-router-dom';
import booksCatalog from '../books.json';
import './BookPage.css';
import { useState, useMemo, useCallback } from 'react';
import ReaderModal from '../widgets/Reader/ReaderModal';
import { loadBookText } from '../utils/loadBook';



export default function BookPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentReadingBook, setCurrentReadingBook] = useState(null);
  const [bookPages, setBookPages] = useState({});
  const [readingPages, setReadingPages] = useState({});
  
  const book = booksCatalog.find((b) => String(b.id) === id);

  const PAGE_CHARS = 1000;

  const paginateText = (text, approx = PAGE_CHARS) => {
    if (!text) return [''];

    const words = text.split(/\s+/);
    const pages = [];
    let current = '';

    for (const word of words) {
      if ((current + ' ' + word).length <= approx || current.length === 0) {
        current = `${current} ${word}`.trim();
      } else {
        pages.push(current);
        current = word;
      }
    }

    if (current) pages.push(current);
    return pages;
  };





  const openReader = useCallback(async () => {
  let content = book.content;

  try {
    if (typeof content === 'string' && content.endsWith('.txt')) {
      content = await loadBookText(content);
    }
  } catch {
    content = 'Ошибка загрузки книги';
  }

  const paginated = paginateText(content);

  setBookPages((prev) => ({
    ...prev,
    [book.id]: paginated
  }));

  setReadingPages((prev) => ({
    ...prev,
    [book.id]: prev[book.id] ?? 0
  }));

  setCurrentReadingBook({ ...book, content });
}, [book]);







  const pages = useMemo(() => {
  return currentReadingBook
    ? (bookPages[currentReadingBook.id] ?? [])
    : [];
}, [currentReadingBook, bookPages]);

const readingPage = currentReadingBook
  ? (readingPages[currentReadingBook.id] ?? 0)
  : 0;





  const nextPage = () => {
  if (!currentReadingBook) return;

  const id = currentReadingBook.id;

  setReadingPages((prev) => ({
    ...prev,
    [id]: Math.min((prev[id] ?? 0) + 1, pages.length - 1)
  }));
};

const prevPage = () => {
  if (!currentReadingBook) return;

  const id = currentReadingBook.id;

  setReadingPages((prev) => ({
    ...prev,
    [id]: Math.max((prev[id] ?? 0) - 1, 0)
  }));
};




  if (!book) {
    return <div className="book-page">Книга не найдена</div>;
  }

  return (
    <div className="book-page">

      <div className="book-bg" style={{ backgroundImage: `url(${book.cover})` }} />

      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Назад
      </button>

      <div className="book-layout">

        {/* ОБЛОЖКА */}
        <div className="book-cover">
          <img src={book.cover} alt={book.title} />
        </div>

        {/* ИНФА */}
        <div className="book-info">
          <h1>{book.title}</h1>
          <h3>{book.author}</h3>

          {/* МЕТА */}
          <div className="book-meta">
            <span>{book.year || '—'} год</span>
            <span>{book.pages || '—'} стр.</span>
          </div>

          {/* ЖАНРЫ */}
          <div className="book-genres">
            {(book.genres || []).map((g) => (
              <span key={g}>{g}</span>
            ))}
          </div>

          {/* ОПИСАНИЕ */}
          <p className="book-description">
            {book.description || "Описание отсутствует"}
          </p>

          {/* КНОПКИ */}
          <div className="book-actions">
            <button className="read-btn" onClick={openReader}>
              Читать
            </button>

            <button className="secondary-btn">
              В избранное
            </button>
          </div>
            

        </div>


                    
              {currentReadingBook && (
                <ReaderModal
                  book={currentReadingBook}
                  pages={pages}
                  pageIndex={readingPage}
                  onClose={() => setCurrentReadingBook(null)}
                  nextPage={nextPage}
                  prevPage={prevPage}
                  goToPage={(p) =>
                    setReadingPages((prev) => ({
                      ...prev,
                      [currentReadingBook.id]: p
                    }))
                  }
                />
              )}


      </div>
    </div>
  );
}