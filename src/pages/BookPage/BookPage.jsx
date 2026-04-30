import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SAMPLE_BOOKS as booksCatalog } from '../../data';
import { GENRE_LABELS } from '../../genres';
import { loadBookText } from '../../utils/loadBook';
import ReaderModal from '../../widgets/Reader/ReaderModal';
import './BookPage.css';

const PAGE_CHARS = 1000;
const FAVORITES_STORAGE_KEY = 'favorite-books';
const READING_PAGES_STORAGE_KEY = 'reading-pages';
const OPENED_BOOKS_STORAGE_KEY = 'opened-books';

const readJsonFromStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const paginateText = (text, approxCharsPerPage = PAGE_CHARS) => {
  if (!text) return ['Текст книги пока недоступен.'];

  const words = text.replace(/\s+/g, ' ').trim().split(' ');
  const pages = [];
  let current = '';

  words.forEach((word) => {
    if (!current) {
      current = word;
      return;
    }

    const candidate = `${current} ${word}`;

    if (candidate.length <= approxCharsPerPage) {
      current = candidate;
    } else {
      pages.push(current);
      current = word;
    }
  });

  if (current) pages.push(current);

  return pages.length ? pages : ['Текст книги пока недоступен.'];
};

const getFallbackBookText = (book, errorMessage) => {
  const parts = [book.title, book.author, '', book.description || 'Описание пока отсутствует.'];

  if (!book.content) {
    parts.push('', 'Полный текст этой книги пока не добавлен в каталог.');
  } else if (errorMessage) {
    parts.push('', `Не получилось загрузить файл книги. ${errorMessage}`);
  }

  return parts.join('\n');
};

const clampPage = (page, pagesCount) => {
  const maxPage = Math.max(pagesCount - 1, 0);
  return Math.min(Math.max(Number(page) || 0, 0), maxPage);
};

export default function BookPage() {
  const { id } = useParams();

  const book = useMemo(
    () => booksCatalog.find((item) => String(item.id) === String(id)),
    [id]
  );

  const [currentReadingBook, setCurrentReadingBook] = useState(null);
  const [bookPages, setBookPages] = useState({});
  const [readingPages, setReadingPages] = useState(() =>
    readJsonFromStorage(READING_PAGES_STORAGE_KEY, {})
  );
  const [openedBooks, setOpenedBooks] = useState(() =>
    readJsonFromStorage(OPENED_BOOKS_STORAGE_KEY, {})
  );
  const [favoriteBooks, setFavoriteBooks] = useState(() =>
    readJsonFromStorage(FAVORITES_STORAGE_KEY, [])
  );

  const favoriteBookIds = Array.isArray(favoriteBooks) ? favoriteBooks : [];
  const isFavorite = book
    ? favoriteBookIds.some((favoriteId) => String(favoriteId) === String(book.id))
    : false;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [id]);

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteBooks));
  }, [favoriteBooks]);

  useEffect(() => {
    localStorage.setItem(READING_PAGES_STORAGE_KEY, JSON.stringify(readingPages));
  }, [readingPages]);

  useEffect(() => {
    localStorage.setItem(OPENED_BOOKS_STORAGE_KEY, JSON.stringify(openedBooks));
  }, [openedBooks]);

  const toggleFavorite = useCallback(() => {
    if (!book) return;

    setFavoriteBooks((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const hasBook = safePrev.some((favoriteId) => String(favoriteId) === String(book.id));

      return hasBook
        ? safePrev.filter((favoriteId) => String(favoriteId) !== String(book.id))
        : [...safePrev, book.id];
    });
  }, [book]);

  const pages = useMemo(() => {
    if (!currentReadingBook) return [];
    return bookPages[currentReadingBook.id] || [];
  }, [bookPages, currentReadingBook]);

  const readingPage = currentReadingBook
    ? clampPage(readingPages[currentReadingBook.id], pages.length)
    : 0;

  const openReader = useCallback(async () => {
    if (!book) return;

    let content = '';

    try {
      content =
        typeof book.content === 'string' && book.content.trim()
          ? await loadBookText(book.content)
          : getFallbackBookText(book);
    } catch (error) {
      content = getFallbackBookText(book, error.message);
    }

    const paginated = paginateText(content);

    setBookPages((prev) => ({
      ...prev,
      [book.id]: paginated,
    }));

    setReadingPages((prev) => ({
      ...prev,
      [book.id]: clampPage(prev[book.id], paginated.length),
    }));

    setOpenedBooks((prev) => ({
      ...prev,
      [book.id]: (prev[book.id] || 0) + 1,
    }));

    setCurrentReadingBook({
      ...book,
      content,
      pagesCount: paginated.length,
    });
  }, [book]);

  const nextPage = useCallback(() => {
    if (!currentReadingBook) return;

    setReadingPages((prev) => ({
      ...prev,
      [currentReadingBook.id]: clampPage((prev[currentReadingBook.id] || 0) + 1, pages.length),
    }));
  }, [currentReadingBook, pages.length]);

  const prevPage = useCallback(() => {
    if (!currentReadingBook) return;

    setReadingPages((prev) => ({
      ...prev,
      [currentReadingBook.id]: clampPage((prev[currentReadingBook.id] || 0) - 1, pages.length),
    }));
  }, [currentReadingBook, pages.length]);

  const goToPage = useCallback(
    (pageNumber) => {
      if (!currentReadingBook) return;

      setReadingPages((prev) => ({
        ...prev,
        [currentReadingBook.id]: clampPage(pageNumber, pages.length),
      }));
    },
    [currentReadingBook, pages.length]
  );

  useEffect(() => {
    if (!currentReadingBook) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setCurrentReadingBook(null);
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        nextPage();
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        prevPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentReadingBook, nextPage, prevPage]);

  if (!book) {
    return (
      <div className="book-page">
        <div className="book-not-found">Книга не найдена.</div>
      </div>
    );
  }

  return (
    <div className="book-page">
      <div className="book-bg" style={{ backgroundImage: `url(${book.cover})` }} />

      <div className="book-layout">
        <div className="book-cover">
          <img src={book.cover} alt={book.title} />
        </div>

        <div className="book-info">
          <h1>{book.title}</h1>

          <h3 className="book-author">
            <span>Автор:</span>
            {book.author}
          </h3>

          <div className="book-meta">
            <span>{book.year || 'Год неизвестен'}</span>
            <span>{book.content ? 'Текст доступен' : 'Текст скоро будет добавлен'}</span>
          </div>

          <div className="book-genres">
            {(book.genres || []).map((genre) => (
              <span key={genre}>{GENRE_LABELS[genre] || genre}</span>
            ))}
          </div>

          <p className="book-description">{book.description || 'Описание отсутствует.'}</p>

          <div className="book-actions">
            <button className="read-btn" type="button" onClick={openReader}>
              Читать
            </button>

            <button
              className={`favorite-btn ${isFavorite ? 'active' : ''}`}
              type="button"
              onClick={toggleFavorite}
            >
              {isFavorite ? 'В избранном' : 'В избранное'}
            </button>
          </div>
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
          goToPage={goToPage}
        />
      )}
    </div>
  );
}
