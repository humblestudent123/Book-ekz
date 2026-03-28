import React from 'react';
import PropTypes from 'prop-types';

export default function BookCard({ book, onSelect }) {
  return (
    <div className="book-card" onClick={() => onSelect(book)}>
      <h3>{book.title}</h3>
      <p>{book.author} · {book.year}</p>
      <div style={{ marginTop: '10px' }}>
        {book.tags.map(t => <span key={t} className="tag">{t}</span>)}
      </div>
    </div>
  );
}

BookCard.propTypes = {
  book: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
};
