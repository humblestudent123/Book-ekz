import React, { useState, useEffect, useMemo, useCallback } from 'react';
import SearchBar from '../components/SearchBar';
import BookList from '../widgets/BookList/BookList';
import ReaderModal from '../widgets/Reader/ReaderModal';
import { SAMPLE_BOOKS } from '../data';
import '../App.css';

const LOAD_MORE_STEP = 6;
const PAGE_CHARS = 1000;
const ALL_GENRE = 'Все';

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

export default function Library() {
  const books = SAMPLE_BOOKS;
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [genreFilter, setGenreFilter] = useState(ALL_GENRE);
  const [showCount, setShowCount] = useState(LOAD_MORE_STEP);
  const [isReading, setIsReading] = useState(false);
  const [pages, setPages] = useState([]);
  const [readingPages, setReadingPages] = useState(() => {
    const saved = localStorage.getItem('reading-pages');
    return saved ? JSON.parse(saved) : {};
  });

  const readingPage = selected ? (readingPages[selected.id] ?? 0) : 0;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter(b =>
      (genreFilter === ALL_GENRE || b.genres.includes(genreFilter)) &&
      (!q || `${b.title} ${b.author} ${b.tags.join(' ')}`.toLowerCase().includes(q))
    );
  }, [books, query, genreFilter]);

  const visibleBooks = useMemo(() => filtered.slice(0, showCount), [filtered, showCount]);

  const genres = useMemo(() => {
    const setG = new Set();
    books.forEach(b => b.genres.forEach(g => setG.add(g)));
    return [ALL_GENRE, ...Array.from(setG)];
  }, [books]);

  // Рекомендации теперь всегда доступны, но можно задать свои
  const recommendations = useMemo(() => {
    // Возвращаем 4 книги из SAMPLE_BOOKS как рекомендации
    return books.slice(0, 4);
  }, [books]);

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

  const goToPage = useCallback((pageNum) => {
    if (!selected) return;
    const clamped = Math.min(Math.max(pageNum, 0), pages.length - 1);
    setReadingPages(prev => ({ ...prev, [selected.id]: clamped }));
  }, [selected, pages.length]);

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
    if (selected.content) loadBook(selected.content);
    else {
      fetch(contentUrl)
        .then(r => r.text())
        .then(text => {
          setSelected(prev => ({ ...prev, content: text }));
          loadBook(text);
        })
        .catch(err => console.error(err));
    }
  }, [selected, readingPages]);

  const loadMore = () => setShowCount(prev => Math.min(prev + LOAD_MORE_STEP, filtered.length));

  useEffect(() => {
    localStorage.setItem('reading-pages', JSON.stringify(readingPages));
  }, [readingPages]);

  return (
    <div className="library-container">
      <header className="header">
        <h1>ReadNext</h1>
        <SearchBar query={query} setQuery={setQuery} />
      </header>
      
      <main className="main-grid">
        {/* Рекомендации теперь всегда доступны */}
      {/* Рекомендации теперь всегда доступны */}
      <section className="recommendations-section">
        <h3>Рекомендации</h3>
        <div className="recommendations-grid">
          {recommendations.map((book) => (
            <div 
              key={book.id} 
              className="recommendation-card"
              onClick={(e) => {
                e.stopPropagation();
                // Просто открываем модалку с этой книгой, но не меняем selected
                setSelected(book);
              }}
            >
              <h4>{book.title}</h4>
              <p>{book.author}</p>
            </div>
          ))}
        </div>
      </section>



        <BookList
          books={visibleBooks}
          visibleCount={showCount}
          onSelect={setSelected}
          loadMore={loadMore}
          genreFilter={genreFilter}
          setGenreFilter={setGenreFilter}
          genres={genres}
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
    </div>
  );
}
