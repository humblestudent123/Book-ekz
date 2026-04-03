// --- Imports ---
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SearchBar   from '../components/SearchBar';
import Sidebar     from '../components/Sidebar';
import BookList    from '../widgets/BookList/BookList';
import ReaderModal from '../widgets/Reader/ReaderModal';
import HomePage    from '../HomePage/HomePage';
import { SAMPLE_BOOKS } from '../data';

// --- constants ---
const LOAD_MORE_STEP = 6;
const PAGE_CHARS      = 1000;
const ALL_GENRE       = 'Все';

// --- utils ---
const paginateText = (text, approxCharsPerPage = PAGE_CHARS) => {
  if (!text) return [''];
  const words = text.split(/\s+/);
  const pages = [];
  let current = '';

  for (let word of words) {
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

// --- App component ---
export default function App() {
  /* ---------- state ---------- */
  const books = SAMPLE_BOOKS;

  const [query, setQuery]   = useState('');
  const [selected, setSelected] = useState(null);
  const [genreFilter, setGenreFilter] = useState(ALL_GENRE);
  const [showCount, setShowCount]     = useState(LOAD_MORE_STEP);

  /* ---------- reader state ---------- */
  const [isReading, setIsReading]   = useState(false);
  const [pages, setPages]           = useState([]);
  const [readingPages, setReadingPages] = useState(() => {
    try {
      const saved = localStorage.getItem('reading-pages');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.warn('[App] Failed to parse reading pages from localStorage', e);
      return {};
    }
  });

  // Текущая страница выбранной книги
  const readingPage = selected ? (readingPages[selected.id] ?? 0) : 0;

  /* ---------- filtered books & visible slice ---------- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter(b =>
      (genreFilter === ALL_GENRE || b.genres.includes(genreFilter)) &&
      (!q || `${b.title} ${b.author} ${b.tags.join(' ')}`.toLowerCase().includes(q))
    );
  }, [books, query, genreFilter]);

  const visibleBooks = useMemo(() => filtered.slice(0, showCount), [filtered, showCount]);

  /* ---------- жанры ---------- */
  const genres = useMemo(() => {
    const setG = new Set();
    books.forEach(b => b.genres.forEach(g => setG.add(g)));
    return [ALL_GENRE, ...Array.from(setG)];
  }, [books]);

  /* ---------- рекомендации ---------- */
  const recommendations = useMemo(() => {
    if (!selected) return books.slice(0, 4);
    const recs = books.filter(
      b => b.id !== selected.id && b.genres.some(g => selected.genres.includes(g))
    );
    return recs.length > 0 ? recs : books.filter(b => b.id !== selected.id).slice(0, 4);
  }, [selected, books]);

  /* ---------- навигация кнопочками ---------- */
  const nextPage = useCallback(() => {
    if (!selected) return;
    setReadingPages(prev => ({
      ...prev,
      [selected.id]: Math.min((prev[selected.id] ?? 0) + 1, pages.length - 1)
    }));
  }, [selected, pages.length]);

  const prevPage = useCallback(() => {
    if (!selected) return;
    setReadingPages(prev => ({
      ...prev,
      [selected.id]: Math.max((prev[selected.id] ?? 0) - 1, 0)
    }));
  }, [selected, pages.length]);

  const goToPage = useCallback(
    pageNum => {
      if (!selected) return;
      const clamped = Math.min(Math.max(pageNum, 0), pages.length - 1);
      setReadingPages(prev => ({
        ...prev,
        [selected.id]: clamped
      }));
    },
    [selected, pages.length]
  );

  useEffect(() => {
    if (!isReading) return;
    const onKey = e => {
      switch (e.key) {
        case 'Escape': setIsReading(false); break;
        case 'ArrowRight': nextPage(); break;
        case 'ArrowLeft': prevPage(); break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isReading, nextPage, prevPage]);

  /* ---------- ридер ---------- */
  const openReader = useCallback(() => {
    if (!selected) return;

    const { id: bookId, contentUrl } = selected;

    const loadBook = content => {
      const paginated = paginateText(content, PAGE_CHARS);
      const savedPage = readingPages[bookId] ?? 0;
      setPages(paginated);
      setReadingPages(prev => ({ ...prev, [bookId]: savedPage }));
      setIsReading(true);
    };

    if (selected.content) {
      loadBook(selected.content);
    } else {
      fetch(contentUrl)
        .then(r => r.text())
        .then(text => {
          setSelected(prev => ({ ...prev, content: text }));
          loadBook(text);
        })
        .catch(err => console.error('Не удалось загрузить текст', err));
    }
  }, [selected, readingPages]);

  /* ---------- загрузка больше книг ---------- */
  const loadMore = () => setShowCount(prev => Math.min(prev + LOAD_MORE_STEP, filtered.length));

  /* ---------- сохранять страницы чтения в локальное хранилище ---------- */
  useEffect(() => {
    localStorage.setItem('reading-pages', JSON.stringify(readingPages));
  }, [readingPages]);

  /* ---------- UI рендер ---------- */
  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <h1 id='h1'>ReadNext</h1>
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
        приложение находится в BETA любые баги и не точности возможны
      </footer>

      {/* Reader modal */}
      {isReading && selected && (
        <ReaderModal
          book={selected}
          pages={pages}
          pageIndex={readingPage}
          onClose={() => setIsReading(false)}
          nextPage={nextPage}
          prevPage={prevPage}
          goToPage={goToPage}
        />
      )}
    </div>
  );
}
