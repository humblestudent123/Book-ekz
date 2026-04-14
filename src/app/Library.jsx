import React, { useState, useEffect, useMemo, useCallback } from 'react';
import SearchBar from '../components/SearchBar';
import BookList from '../widgets/BookList/BookList';
import ReaderModal from '../widgets/Reader/ReaderModal';
import { SAMPLE_BOOKS } from '../data';
import '../App.css';
import logo from '../assets/ReadNext-logo.png';

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

  const [currentReadingBook, setCurrentReadingBook] = useState(null);
  const [query, setQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState(ALL_GENRE);
  const [showCount, setShowCount] = useState(LOAD_MORE_STEP);
  const [pages, setPages] = useState([]);
  const [readingPages, setReadingPages] = useState(() => {
    const saved = localStorage.getItem('reading-pages');
    return saved ? JSON.parse(saved) : {};
  });

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

  const recommendations = useMemo(() => {
    const recs = currentReadingBook
      ? books.filter(
          b =>
            b.id !== currentReadingBook.id &&
            b.genres.some(g => currentReadingBook.genres.includes(g))
        )
      : books;

    return recs.length > 0 ? recs.slice(0, 4) : books.slice(0, 4);
  }, [books, currentReadingBook]);

  const readingPage = currentReadingBook ? (readingPages[currentReadingBook.id] ?? 0) : 0;

  const nextPage = useCallback(() => {
    if (!currentReadingBook) return;
    setReadingPages(prev => ({
      ...prev,
      [currentReadingBook.id]: Math.min((prev[currentReadingBook.id] ?? 0) + 1, pages.length - 1)
    }));
  }, [currentReadingBook, pages.length]);

  const prevPage = useCallback(() => {
    if (!currentReadingBook) return;
    setReadingPages(prev => ({
      ...prev,
      [currentReadingBook.id]: Math.max((prev[currentReadingBook.id] ?? 0) - 1, 0)
    }));
  }, [currentReadingBook, pages.length]);

  const goToPage = useCallback((pageNum) => {
    if (!currentReadingBook) return;
    const clamped = Math.min(Math.max(pageNum, 0), pages.length - 1);
    setReadingPages(prev => ({ ...prev, [currentReadingBook.id]: clamped }));
  }, [currentReadingBook, pages.length]);

  const openReader = useCallback(async (book) => {
    if (!book) return;
  
    let content = book.content;
  
    try {
      if (content && content.endsWith('.txt')) {
        const res = await fetch(content);
        content = await res.text();
      }
    } catch (e) {
      content = "Ошибка загрузки книги";
    }
  
    const paginated = paginateText(content, PAGE_CHARS);
    const savedPage = readingPages[book.id] ?? 0;
  
    setPages(paginated);
    setReadingPages(prev => ({ ...prev, [book.id]: savedPage }));
    setCurrentReadingBook({ ...book, content }); // важно
  }, [readingPages]);

  useEffect(() => {
    const onKey = e => {
      switch (e.key) {
        case 'Escape': setCurrentReadingBook(null); break;
        case 'ArrowRight': nextPage(); break;
        case 'ArrowLeft': prevPage(); break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [nextPage, prevPage]);

  const loadMore = () => setShowCount(prev => Math.min(prev + LOAD_MORE_STEP, filtered.length));

  useEffect(() => {
    localStorage.setItem('reading-pages', JSON.stringify(readingPages));
  }, [readingPages]);

  return (
    <div className="library-container">
      <header className="header">
        <img src={logo} alt="ReadNext Logo" id='logo' />
        <SearchBar query={query} setQuery={setQuery} />
      </header>

      <main className="main-grid">
        <section className="recommendations-section">
          <h3>Рекомендации</h3>
          <div className="recommendations-grid">
            {recommendations.map(book => (
              <div
                key={book.id}
                className="recommendation-card"
                onClick={(e) => {
                  e.stopPropagation();
                  openReader(book);
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
          onSelect={(book) => openReader(book)}
          loadMore={loadMore}
          genreFilter={genreFilter}
          setGenreFilter={setGenreFilter}
          genres={genres}
        />
      </main>

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