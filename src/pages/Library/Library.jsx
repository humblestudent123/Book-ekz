import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/SearchBar/SearchBar';
import BookList from '../../widgets/BookList/BookList';
import { fetchRecommendations } from '../../api/recommendationsApi';
import { SAMPLE_BOOKS as booksCatalog } from '../../data';
import { GENRE_LABELS } from '../../genres';
import { useDebounce } from '../../hooks/useDebounce';
import logo from '../../assets/ReadNext-logo.png';

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
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [favoriteBookIds, setFavoriteBookIds] = useState(readFavoriteBookIds);
  const [recoBookIds, setRecoBookIds] = useState(null);
  const [recoCourses, setRecoCourses] = useState([]);
  const [recoMeta, setRecoMeta] = useState(null);
  const [recoLoading, setRecoLoading] = useState(false);
  const [recoError, setRecoError] = useState(null);

  const debouncedQuery = useDebounce(query, 300);
  const books = booksCatalog;
  const genreOptions = useMemo(
    () =>
      Object.entries(GENRE_LABELS).filter(([genre]) =>
        books.some((book) => (book.genres || []).includes(genre))
      ),
    [books]
  );

  useEffect(() => {
    const syncFavorites = () => setFavoriteBookIds(readFavoriteBookIds());

    window.addEventListener('storage', syncFavorites);
    window.addEventListener('focus', syncFavorites);

    return () => {
      window.removeEventListener('storage', syncFavorites);
      window.removeEventListener('focus', syncFavorites);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadRecommendations() {
      setRecoLoading(true);
      setRecoError(null);
      try {
        const data = await fetchRecommendations(favoriteBookIds, { signal: controller.signal });
        if (controller.signal.aborted) return;
        const ids = Array.isArray(data.bookIds) ? data.bookIds.map(Number).filter(Number.isFinite) : [];
        setRecoBookIds(ids.length ? ids : null);
        setRecoCourses(Array.isArray(data.courses) ? data.courses : []);
        setRecoMeta(data.meta || null);
      } catch (e) {
        if (controller.signal.aborted) return;
        setRecoBookIds(null);
        setRecoCourses([]);
        setRecoMeta(null);
        setRecoError(e?.message || 'Не удалось загрузить рекомендации');
      } finally {
        if (!controller.signal.aborted) setRecoLoading(false);
      }
    }

    loadRecommendations();
    return () => controller.abort();
  }, [favoriteBookIds]);

  const openBookPreview = useCallback(
    (book) => {
      navigate(`/library/book/${book.id}`);
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

  const staticRecommendedBooks = useMemo(() => books.filter((book) => book.featured), [books]);

  const recommendedBooks = useMemo(() => {
    if (!recoBookIds || recoBookIds.length === 0) {
      return staticRecommendedBooks;
    }
    const byId = new Map(books.map((b) => [b.id, b]));
    return recoBookIds.map((id) => byId.get(id)).filter(Boolean);
  }, [books, recoBookIds, staticRecommendedBooks]);

  const recommendationsDescription = useMemo(() => {
    if (recoLoading) return 'Загружаем персональный подбор…';
    if (recoError) return `Офлайн-подбор (API недоступен): ${recoError}`;
    if (recoBookIds?.length && recoMeta) {
      const cache = recoMeta.cache === 'HIT' ? 'ответ из кэша Redis' : 'ответ вычислен на сервере';
      const ms =
        typeof recoMeta.latencyMs === 'number' ? ` · ${recoMeta.latencyMs} мс` : '';
      return `Персонально · ${cache}${ms}`;
    }
    return 'Подбор по меткам «избранного» и популярности каталога.';
  }, [recoLoading, recoError, recoBookIds, recoMeta]);

  const newBooks = useMemo(() => books.filter((book) => book.isNew), [books]);
  const popularBooks = useMemo(() => books.filter((book) => book.isPopular), [books]);
  const favoriteBooks = useMemo(
    () => {
      const normalizedFavoriteIds = favoriteBookIds.map(String);
      return books.filter((book) => normalizedFavoriteIds.includes(String(book.id)));
    },
    [books, favoriteBookIds]
  );

  const isFiltering = debouncedQuery.trim().length > 0 || selectedGenre !== 'all';

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

        <section className="catalog-toolbar" aria-label="Фильтры каталога" data-testid="catalog-filters">
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
        {isFiltering ? (
          <BookList
            title="Результаты поиска"
            books={filteredBooks}
            onSelect={openBookPreview}
            emptyMessage="По этим условиям ничего не найдено."
          />
        ) : (
          <>
            <BookList
              title="Рекомендации"
              description={recommendationsDescription}
              books={recommendedBooks}
              onSelect={openBookPreview}
            />

            {recoCourses.length > 0 ? (
              <section className="shelf-section reco-courses" aria-label="Рекомендованные курсы">
                <div className="shelf-section__header">
                  <div>
                    <h2>Курсы для тебя</h2>
                    <p>Подборка онлайн-курсов в тему твоих интересов (данные с сервиса рекомендаций).</p>
                  </div>
                </div>
                <ul className="reco-courses__list">
                  {recoCourses.map((c) => (
                    <li key={c.id} className="reco-courses__item">
                      <a href={c.url} target="_blank" rel="noopener noreferrer">
                        {c.title}
                      </a>
                      <span className="reco-courses__meta">
                        {c.provider}
                        {c.level ? ` · ${c.level}` : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

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
