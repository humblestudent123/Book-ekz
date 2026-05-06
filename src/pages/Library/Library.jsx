import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CatalogTabs from '../../components/CatalogTabs/CatalogTabs';
import SearchBar from '../../components/SearchBar/SearchBar';
import BookList from '../../widgets/BookList/BookList';
import { SAMPLE_BOOKS as booksCatalog } from '../../data';
import { COURSES as coursesCatalog } from '../../data/courses';
import { useLibraryState } from '../../context/LibraryContext';
import { GENRE_LABELS } from '../../genres';
import { useDebounce } from '../../hooks/useDebounce';
import logo from '../../assets/ReadNext-logo.png';

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
  const [selectedGenre, setSelectedGenre] = useState('all');
  const debouncedQuery = useDebounce(query, 300);

  const { favoriteBookIds } = useLibraryState();

  const books = booksCatalog;
  const courses = coursesCatalog;

  const genreOptions = useMemo(
    () =>
      Object.entries(GENRE_LABELS).filter(([genre]) =>
        books.some((book) => (book.genres || []).includes(genre))
      ),
    [books]
  );

  const openBookPreview = useCallback(
    (book) => {
      navigate(`/library/book/${book.id}`);
    },
    [navigate]
  );

  const openCoursePreview = useCallback(
    (course) => {
      navigate(`/courses/${course.id}`);
    },
    [navigate]
  );

  const filteredBooks = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();

    return books.filter((book) => {
      const matchesQuery = !q || getSearchText(book).includes(q);
      const matchesGenre =
        selectedGenre === 'all' || (book.genres || []).includes(selectedGenre);

      return matchesQuery && matchesGenre;
    });
  }, [books, debouncedQuery, selectedGenre]);

  const recommendedBooks = useMemo(() => books.filter((book) => book.featured), [books]);
  const newBooks = useMemo(() => books.filter((book) => book.isNew), [books]);
  const popularBooks = useMemo(() => books.filter((book) => book.isPopular), [books]);
  const favoriteBooks = useMemo(() => {
    const normalizedFavoriteIds = favoriteBookIds.map(String);
    return books.filter((book) => normalizedFavoriteIds.includes(String(book.id)));
  }, [books, favoriteBookIds]);

  const isFiltering = debouncedQuery.trim().length > 0 || selectedGenre !== 'all';

  return (
    <div className="library-container">
      <header className="header">
        <div className="header-bar">
          <div className="logo-block">
            <img src={logo} alt="ReadNext" className="logo" />
          </div>
          <CatalogTabs />
          <SearchBar query={query} setQuery={setQuery} />
        </div>

        <section className="hero-banner">
          <div className="hero-banner__content">
            <div className="hero-banner__text">
              <span className="hero-banner__eyebrow">Твоя домашняя читалка</span>
              <h1>Книги и курсы в одном маршруте обучения</h1>
              <p>
                Открывай карточку книги, смотри описание, добавляй в избранное и
                продолжай чтение с сохраненной страницы.
              </p>
            </div>
          </div>
        </section>

        <section
          className="catalog-toolbar"
          aria-label="Фильтры каталога"
          data-testid="catalog-filters"
        >
          <label className="toolbar-field" htmlFor="genre-filter">
            <span>Жанр</span>
            <select
              id="genre-filter"
              value={selectedGenre}
              onChange={(event) => setSelectedGenre(event.target.value)}
              data-testid="genre-filter"
            >
              <option value="all">Все жанры</option>
              {genreOptions.map(([genre, label]) => (
                <option key={genre} value={genre}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </section>
      </header>

      <main className="main-grid">
          {!isFiltering && (
            <>
              {/* Блок рекомендаций (только книги) */}
              <BookList
                title="Рекомендации"
                books={recommendedBooks}
                onSelect={openBookPreview}
                // Можно добавить: emptyMessage="Нет рекомендаций" 
              />

              {/* Остальные полки — уже только книги */}
              <BookList
                title="Избранное"
                books={favoriteBooks}
                onSelect={openBookPreview}
                emptyMessage="Ты еще не добавил книги в избранное."
              />

              <BookList 
                title="Новинки" 
                books={newBooks} 
                onSelect={openBookPreview} 
              />

              <BookList 
                title="Популярное" 
                books={popularBooks} 
                onSelect={openBookPreview} 
              />


              <BookList
                title="Весь каталог"
                books={books}
                onSelect={openBookPreview}
                emptyMessage="Книги в каталоге отсутствуют."
              />
            </>
          )}

      </main>
    </div>
  );
}
