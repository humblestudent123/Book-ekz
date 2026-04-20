import React from 'react';
import PropTypes from 'prop-types';

export default function BookCard({ book, onSelect }) {
  return (
    <div className="book-card" onClick={() => onSelect(book)}>
      
      <div className="book-card__image-wrapper">
        <img
          src={book.cover}
          alt={book.title}
          className="book-card__cover"
          loading="lazy"
        />
      </div>

      <div className="book-card__info">
        <h3>{book.title}</h3>
        <p>{book.author}</p>
      </div>

    </div>
  );  
}