import React, { useState, useMemo, useEffect, useCallback } from 'react';
import './App.scss';
import SearchBar from '../components/SearchBar';
import BookList from '../widgets/BookList/BookList';
import ReaderModal from '../widgets/Reader/ReaderModal';
import { SAMPLE_BOOKS } from '../data';
import Library from './Library';
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

export default function App() {
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

  const readingPage = selected ? readingPages[selected.id] || 0 : 0;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter(
      b =>
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
    if (!selected) return books.slice(0, 4);
    const recs = books.filter(
      b => b.id !== selected.id && b.genres.some(g => selected.genres.includes(g))
    );
    return recs.length ? recs : books.filter(b => b.id !== selected.id).slice(0, 4);
  }, [selected, books]);

  const nextPage = useCallback(() => {
    if (!selected) return;
    setReadingPages(prev => ({
      ...prev,
      [selected.id]: Math.min((prev[selected.id] || 0) + 1, pages.length - 1),
    }));
  }, [selected, pages.length]);

  const prevPage = useCallback(() => {
    if (!selected) return;
    setReadingPages(prev => ({
      ...prev,
      [selected.id]: Math.max((prev[selected.id] || 0) - 1, 0),
    }));
  }, [selected, pages.length]);

  const openReader = useCallback(() => {
    if (!selected) return;
    const { id: bookId, contentUrl } = selected;

    const loadBook = content => {
      const paginated = paginateText(content, PAGE_CHARS);
      const savedPage = readingPages[bookId] || 0;
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
        .catch(err => {
          console.error('Ошибка загрузки книги:', err);
          
        });
    }
  }, [selected, readingPages]);

  const loadMore = () => setShowCount(prev => Math.min(prev + LOAD_MORE_STEP, filtered.length));

  useEffect(() => {
    localStorage.setItem('reading-pages', JSON.stringify(readingPages));
  }, [readingPages]);

  return (
    <div className="app-container">
      <Library />
    </div>
  );
}
