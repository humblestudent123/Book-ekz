import React from 'react';
import PropTypes from 'prop-types';
import './BookCard.css'
import { GENRE_LABELS } from '../../genres';

export default function BookCard({ book, onSelect }) {
  
  console.log(book.id, book.cover);
  return (
    <div className="book-card" onClick={() => onSelect(book)}>
      <div className="book-card__image-wrapper">
        <img
          src={book.cover}
          alt={book.title}
          className="book-card__cover"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/covers/fallback.jpg';
          }}
        />
      </div>

      <div className="book-card__info">
        <h3>{book.title}</h3>
        <p>{book.author}</p>
        <span className="book-card__year">{book.year}</span>
        <div className="book-card__genres">
          {(book.genres || []).slice(0, 2).map((genre) => (
            <span
              key={genre}
              className="book-card__genre-chip"
            >
              {GENRE_LABELS[genre] || genre}
            </span>
          ))}
        </div>
      </div>
    </div>
  );  
}

BookCard.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    year: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    cover: PropTypes.string,
    genres: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  onSelect: PropTypes.func.isRequired
};
