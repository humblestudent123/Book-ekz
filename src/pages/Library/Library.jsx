import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/SearchBar/SearchBar';
import BookList from '../../widgets/BookList/BookList';
import { SAMPLE_BOOKS as booksCatalog } from '../../data';
import { GENRE_LABELS } from '../../genres';
import { useDebounce } from '../../hooks/useDebounce';
import logo from '../../assets/ReadNext-logo.png';
import '../../App.css';

const FAVORITES_STORAGE_KEY = 'favorite-books';

const readFavoriteBookIds = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const getSearchText = (book) =>
  [
    book.title,
    book.author,
    book.year,
    ...(book.tags || []),
    ...(book.genres || []).map((genre) => GENRE_LABELS[genre] || genre),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

export default function Library() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [favoriteBookIds, setFavoriteBookIds] = useState(readFavoriteBookIds);

  const debouncedQuery = useDebounce(query, 300);
  const books = booksCatalog;

  useEffect(() => {
    const syncFavorites = () => setFavoriteBookIds(readFavoriteBookIds());

    window.addEventListener('storage', syncFavorites);
    window.addEventListener('focus', syncFavorites);

    return () => {
      window.removeEventListener('storage', syncFavorites);
      window.removeEventListener('focus', syncFavorites);
    };
  }, []);

  const openBookPreview = useCallback(
    (book) => {
      navigate(`/library/book/${book.id}`);
    },
    [navigate]
  );

  const filteredBooks = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return books;

    return books.filter((book) => getSearchText(book).includes(q));
  }, [books, debouncedQuery]);

  const recommendedBooks = useMemo(() => books.filter((book) => book.featured), [books]);
  const newBooks = useMemo(() => books.filter((book) => book.isNew), [books]);
  const popularBooks = useMemo(() => books.filter((book) => book.isPopular), [books]);
  const favoriteBooks = useMemo(
    () => {
      const normalizedFavoriteIds = favoriteBookIds.map(String);
      return books.filter((book) => normalizedFavoriteIds.includes(String(book.id)));
    },
    [books, favoriteBookIds]
  );

  const isSearching = debouncedQuery.trim().length > 0;

  return (
    <div className="library-container">
      <header className="header">
        <div className="header-bar">
          <div className="logo-block">
            <img src={logo} alt="ReadNext" className="logo" />
          </div>
          <SearchBar query={query} setQuery={setQuery} />
        </div>

        <section className="hero-banner">
          <div className="hero-banner__content">
            <div className="hero-banner__text">
              <span className="hero-banner__eyebrow">Твоя домашняя читалка</span>
              <p>
                Открывай карточку книги, смотри описание, добавляй в избранное и продолжай чтение
                с сохраненной страницы.
              </p>
            </div>
          </div>
        </section>
      </header>

      <main className="main-grid">
        {isSearching ? (
          <BookList
            title="Результаты поиска"
            books={filteredBooks}
            onSelect={openBookPreview}
            emptyMessage="По этому запросу ничего не найдено."
          />
        ) : (
          <>
            <BookList
              title="Рекомендации"
              books={recommendedBooks}
              onSelect={openBookPreview}
            />

            <BookList
              title="Избранное"
              books={favoriteBooks}
              onSelect={openBookPreview}
              emptyMessage="Ты еще не добавил книги в избранное."
            />

            <BookList title="Новинки" books={newBooks} onSelect={openBookPreview} />

            <BookList title="Популярное" books={popularBooks} onSelect={openBookPreview} />

            <BookList title="Весь каталог" books={books} onSelect={openBookPreview} />
          </>
        )}
      </main>
    </div>
  );
}
