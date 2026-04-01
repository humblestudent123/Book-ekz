import React, { useState, useMemo, useEffect, useCallback } from 'react';

import SearchBar from '../components/SearchBar';
import Sidebar from '../components/Sidebar';
import BookList from '../widgets/BookList/BookList';
import ReaderModal from '../widgets/Reader/ReaderModal';
import AdminPanel from './pages/AdminPanel'; 
import { getBooks, addBook, deleteBook } from '../api/booksApi';

/* ---------- constants ---------- */
const LOAD_MORE_STEP = 6;
const PAGE_CHARS = 1000; // approx chars per page
const ALL_GENRE = 'Все';







/* ---------- utils ---------- */
const paginateText = (text, approxCharsPerPage = PAGE_CHARS) => {
  if (!text) return [''];
  const words = text.split(/\s+/);
  const pages = [];
  let current = '';

  for (const word of words) {
    const candidate = `${current} ${word}`.trim();
    if (candidate.length <= approxCharsPerPage || !current) {
      current = candidate;
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
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [genreFilter, setGenreFilter] = useState(ALL_GENRE);
  const [showCount, setShowCount] = useState(LOAD_MORE_STEP);

  const [isAdminView, setIsAdminView] = useState(false);

  /* ---------- reader state ---------- */
  const [isReading, setIsReading] = useState(false);
  const [pages, setPages] = useState([]);
  const [readingPages, setReadingPages] = useState(() => {
    const saved = localStorage.getItem('reading-pages');
    return saved ? JSON.parse(saved) : {};
  });

  const readingPage = selected?.id ? readingPages[selected.id] || 0 : 0;


  // Локальная функция для получения книг
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getBooks();
        setBooks(Array.isArray(data) ? data : []); // защита от undefined
      } catch (err) {
        console.error(err);
        setBooks([]);
      }
    };

    fetchBooks();
  }, []);
  

  

  /* ---------- handle book added from admin ---------- */
  const handleBookAdded = useCallback(
    book => setBooks(prev => [...prev, book]),
    []
  );

  /* ---------- filtered & visible books ---------- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (books || []).filter(
      b =>
        (genreFilter === ALL_GENRE || (b.genres || []).includes(genreFilter)) &&
        (!q || `${b.title} ${b.author} ${(b.tags || []).join(' ')}`.toLowerCase().includes(q))
    );
  }, [books, query, genreFilter]);

  const visibleBooks = useMemo(() => filtered.slice(0, showCount), [filtered, showCount]);

  /* ---------- genres ---------- */
  const genres = useMemo(() => {
    const setG = new Set();
    books.forEach(b => (b.genres || []).forEach(g => setG.add(g)));
    return [ALL_GENRE, ...Array.from(setG)];
  }, [books]);

  /* ---------- recommendations ---------- */
  const recommendations = useMemo(() => {
    if (!selected) return books.slice(0, 4);
    const recs = books.filter(
      b =>
        b.id !== selected.id &&
        (b.genres || []).some(g => (selected.genres || []).includes(g))
    );
    return recs.length > 0 ? recs : books.filter(b => b.id !== selected.id).slice(0, 4);
  }, [selected, books]);

  /* ---------- reader initialization ---------- */
  useEffect(() => {
    if (!isReading || !selected || selected.content) return;
    if (selected.contentUrl) {
      fetch(selected.contentUrl)
        .then(r => r.text())
        .then(text => setSelected(prev => ({ ...prev, content: text })))
        .catch(err => console.error(err));
    }
  }, [isReading, selected]);

  /* ---------- keyboard navigation ---------- */
  const nextPage = useCallback(() => {
    if (!selected) return;
    setReadingPages(prev => ({
      ...prev,
      [selected.id]: Math.min((prev[selected.id] || 0) + 1, Math.max(pages.length - 1, 0)),
    }));
  }, [selected, pages]);

  const prevPage = useCallback(() => {
    if (!selected) return;
    setReadingPages(prev => ({
      ...prev,
      [selected.id]: Math.max((prev[selected.id] || 0) - 1, 0),
    }));
  }, [selected]);

  const goToPage = useCallback(
    pageNum => {
      if (!selected) return;
      setReadingPages(prev => ({
        ...prev,
        [selected.id]: Math.min(Math.max(pageNum, 0), pages.length - 1),
      }));
    },
    [selected, pages]
  );

  useEffect(() => {
    if (!isReading) return;
    const onKey = e => {
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
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isReading, nextPage, prevPage]);

  /* ---------- open reader ---------- */
  const openReader = useCallback(() => {
    if (!selected || !selected.contentUrl) return;

    const loadBook = content => {
      const paginated = paginateText(content || '', PAGE_CHARS);
      const savedPage = readingPages[selected.id] ?? 0;
      setPages(paginated);
      setReadingPages(prev => ({ ...prev, [selected.id]: savedPage }));
      setIsReading(true);
    };

    if (selected.content) loadBook(selected.content);
    else if (selected.contentUrl)
      fetch(selected.contentUrl)
        .then(r => r.text())
        .then(text => {
          setSelected(prev => ({ ...prev, content: text }));
          loadBook(text);
        })
        .catch(err => console.error(err));
  }, [selected, readingPages]);

  const loadMore = () => setShowCount(prev => Math.min(prev + LOAD_MORE_STEP, filtered.length));

  useEffect(() => {
    localStorage.setItem('reading-pages', JSON.stringify(readingPages));
  }, [readingPages]);

  /* ---------- admin view ---------- */
  if (isAdminView) {
    return (
      <div className="app-container">
        <header className="header">
          <h1>ReadNext - Admin</h1>
          <button onClick={() => setIsAdminView(false)}>Вернуться на главную</button>
        </header>
        <main>
          <AdminPanel onBookAdded={handleBookAdded} />
        </main>
      </div>
    );
  }

  /* ---------- normal UI ---------- */
  return (
    <div className="app-container">
      <header className="header">
        <h1>ReadNext</h1>
        <SearchBar query={query} setQuery={setQuery} />
        <button onClick={() => setIsAdminView(true)}>Перейти в админку</button>
      </header>

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

      <footer className="footer">
        приложение находится в BETA, баги и неточности возможны
      </footer>
    </div>
  );
}