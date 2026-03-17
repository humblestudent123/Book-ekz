import React, { useRef, useEffect } from 'react';
import BookCard from './BookCard';

export default function BookList({ books, visibleCount, onSelect, loadMore }) {
  const scrollRef = useRef(null);

  // прокрутка «ленивая»
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 50)
        loadMore();   // <-- вызываем правильный колл‑бек
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  const visibleBooks = books.slice(0, visibleCount);

  return (
    <section>
      {/* фильтры уже в App.jsx – можно вынести сюда тоже */}
      <div className="books-scroll" ref={scrollRef}>
        <div className="books-grid">
          {visibleBooks.map(b => (
            <BookCard key={b.id} book={b} onSelect={() => onSelect(b)} />
          ))}
        </div>
      </div>
    </section>
  );
}
