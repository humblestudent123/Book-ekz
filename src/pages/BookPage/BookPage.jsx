import { useParams, useNavigate } from 'react-router-dom';
import { SAMPLE_BOOKS as booksCatalog } from '../../data';
import './BookPage.css';
import { useState, useMemo, useCallback, useEffect  } from 'react';
import ReaderModal from '../../widgets/Reader/ReaderModal';
import { loadBookText } from '../../utils/loadBook';



export default function BookPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentReadingBook, setCurrentReadingBook] = useState(null);
  const [bookPages, setBookPages] = useState({});
  const [readingPages, setReadingPages] = useState({});
  

const book = booksCatalog.find((b) => String(b.id) === id);

const [favoriteBooks, setFavoriteBooks] = useState(() => {
  const saved = localStorage.getItem('favorite-books');
  return saved ? JSON.parse(saved) : [];
});

const isFavorite = book
  ? favoriteBooks.includes(book.id)
  : false;


  





  const toggleFavorite = () => {
  let updated;

  if (isFavorite) {
    updated = favoriteBooks.filter((id) => id !== book.id);
  } else {
    updated = [...favoriteBooks, book.id];
  }

  setFavoriteBooks(updated);

  localStorage.setItem(
    'favorite-books',
    JSON.stringify(updated)
  );
};






  // возращения скрола в исходное сост. 
  useEffect(() => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'auto'
  });
}, []);









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


      <div className="book-layout">

        {/* ОБЛОЖКА */}
        <div className="book-cover">
          <img src={book.cover} alt={book.title} />
        </div>

        {/* ИНФА */}
        <div className="book-info">
          <h1>{book.title}</h1>
          <h3>
            <span>Автор:</span>
            {book.author}
          </h3>




          <h3 className="book-author">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} style={{marginRight: '10px'}}>
              <path d="M21.6 7.34a2.5 2.5 0 0 0-2.5-2.5l-.8.2a2.5 2.5 0 0 0-1.6.7L9.6 14.8a2.5 2.5 0 0 0 .7 3.6l.8.2a2.5 2.5 0 0 0 2.5-2.5l.2-.8c.2-.6.2-1.2-.2-1.8L14.6 9.8a2.5 2.5 0 0 0-3.6-.7l-.2.8a2.5 2.5 0 0 0 .7 3.6l.8.2c.6.2 1.2.2 1.8-.2L19.4 5.8a2.5 2.5 0 0 0-1.8-2.5z"/>
              <path d="M7.8 18.6l-3.6-3.6 3.6-3.6"/>
            </svg>
            {book.author}
          </h3>




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

            <button
              className={`favorite-btn ${isFavorite ? 'active' : ''}`}
              onClick={toggleFavorite}
            >
              {isFavorite ? '♥ В избранном' : '♡ В избранное'}
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