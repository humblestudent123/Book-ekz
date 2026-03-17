// src/App.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';

import SearchBar   from './components/SearchBar';
import BookList    from './components/BookList';
import Sidebar     from './components/Sidebar';
import ReaderModal from './components/ReaderModal';

import { SAMPLE_BOOKS } from './data';

/* ---------- constants ---------- */
const LOAD_MORE_STEP = 6;
const PAGE_CHARS      = 1000;          // approximate characters per page
const ALL_GENRE       = 'Все';         // “All” filter label

/* ---------- utils ---------- */
const paginateText = (text, approxCharsPerPage = PAGE_CHARS) => {
  if (!text) return [''];

  const words = text.split(/\s+/);
  const pages = [];
  let current = '';

  for (let word of words) {
    // Append word to the current page if it fits
    if ((current + ' ' + word).length <= approxCharsPerPage || current.length === 0) {
      current = `${current} ${word}`.trim();
    } else {
      pages.push(current);
      current = word;
    }
  }

  if (current) pages.push(current);

  return pages.length ? pages : [text];
};

/* ---------- App component ---------- */
export default function App() {
  /* ---------- state ---------- */
  const books = SAMPLE_BOOKS; // static dataset

  const [query, setQuery]         = useState('');
  const [selected, setSelected]   = useState(null);
  const [genreFilter, setGenreFilter] = useState(ALL_GENRE);
  const [showCount, setShowCount]          = useState(LOAD_MORE_STEP);

  /* ---------- reader state ---------- */
  const [isReading, setIsReading] = useState(false);
  const [pages, setPages]         = useState([]);
  const [readingPage, setReadingPage] = useState(0);

  /* ---------- filtering ---------- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter(b =>
      (genreFilter === ALL_GENRE || b.genres.includes(genreFilter)) &&
      (!q ||
        `${b.title} ${b.author} ${b.tags.join(' ')}`.toLowerCase().includes(q))
    );
  }, [books, query, genreFilter]);

  const visibleBooks = useMemo(() => filtered.slice(0, showCount), [filtered, showCount]);

  /* ---------- genres list ---------- */
  const genres = useMemo(() => {
    const setG = new Set();
    books.forEach(b => b.genres.forEach(g => setG.add(g)));
    return [ALL_GENRE, ...Array.from(setG)];
  }, [books]);

  /* ---------- recommendations ---------- */
  const recommendations = useMemo(() => {
    if (!selected) return [];
    return books
      .filter(b =>
        b.id !== selected.id &&
        b.genres.some(g => selected.genres.includes(g))
      )
      .slice(0, 4);
  }, [selected, books]);

  /* ---------- reader initialization ---------- */
useEffect(() => {
  if (isReading && selected && !selected.content) {
    fetch(selected.contentUrl)
      .then(r => r.text())
      .then(text =>
        // обновляем только нужное поле у выбранной книги
        setSelected(prev => ({ ...prev, content: text }))
      )
      .catch(err => console.error('Не удалось загрузить текст', err));
  }
}, [isReading, selected]);



useEffect(() => {
  if (isReading && selected) {
    const raw = selected.content || selected.description || '';
    const paginated = paginateText(raw, PAGE_CHARS);

    setPages(paginated);
    setReadingPage(0);          // всегда начинаем с первой страницы
  }
}, [isReading, selected]);      // зависимость от `selected` важна: после fetch он изменится


  /* ---------- keyboard navigation ---------- */
  const nextPage = useCallback(() =>
    setReadingPage(p => Math.min(p + 1, pages.length - 1)), [pages.length]);

  const prevPage = useCallback(() =>
    setReadingPage(p => Math.max(p - 1, 0)), []);

  useEffect(() => {
    if (!isReading) return;

    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          setIsReading(false);
          break;
        case 'ArrowRight':
          nextPage();
          break;
        case 'ArrowLeft':
          prevPage();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isReading, nextPage, prevPage]);

  /* ---------- persistence of page number per book ---------- */
  useEffect(() => {
    if (selected) {
      localStorage.setItem(`reading-page-${selected.id}`, String(readingPage));
    }
  }, [readingPage, selected]);

  /* ---------- actions ---------- */
  const loadMore = () =>
    setShowCount(prev => Math.min(prev + LOAD_MORE_STEP, filtered.length));

  const openReader = useCallback(() => {
    if (selected) setIsReading(true);
  }, [selected]);

  /* ---------- reset showCount when filter/search changes ---------- */
  useEffect(() => {
    setShowCount(LOAD_MORE_STEP);
  }, [query, genreFilter]);

  /* ---------- UI rendering ---------- */
  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <h1>Books — интерфейс и рекомендации</h1>
        <SearchBar query={query} setQuery={setQuery} />
      </header>

      {/* Main layout */}
      <main className="main-grid">
        <BookList
          books={visibleBooks}
          visibleCount={showCount}
          onSelect={setSelected}
          loadMore={loadMore}
          genreFilter={genreFilter}
          setGenreFilter={setGenreFilter}
          genres={genres}
        />

        <Sidebar
          selected={selected}
          setSelected={setSelected}
          recommendations={recommendations}
          reset={() => setSelected(null)}
          openReader={openReader}
        />
      </main>

      {/* Footer */}
      <footer className="footer">
        Подсказки: подключите API, добавьте аналитику и рекомендации.
      </footer>

      {/* Reader modal – only when a book is opened for reading */}
      {isReading && selected && (
        <ReaderModal
          book={selected}
          pages={pages}
          pageIndex={readingPage}
          onClose={() => setIsReading(false)}
          nextPage={nextPage}
          prevPage={prevPage}
        />
      )}
    </div>
  );
}
