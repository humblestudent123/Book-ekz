import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import BookCard from '../../entities/book/BookCard';
import { getRelatedBooks } from '../../utils/recommendations';

function RelatedBooks({ course, books, onSelectBook }) {
  const relatedBooks = useMemo(() => getRelatedBooks(course, books), [books, course]);

  return (
    <section className="shelf-section related-section">
      <div className="shelf-section__header">
        <div>
          <h2>Связанные книги</h2>
          <p>Книги из той же категории помогут продолжить тему курса.</p>
        </div>
      </div>

      {relatedBooks.length ? (
        <div className="books-grid">
          {relatedBooks.map((book) => (
            <BookCard key={book.id} book={book} onSelect={onSelectBook} />
          ))}
        </div>
      ) : (
        <div className="empty-state">Для этой категории книги пока не найдены.</div>
      )}
    </section>
  );
}

RelatedBooks.propTypes = {
  course: PropTypes.object.isRequired,
  books: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelectBook: PropTypes.func.isRequired,
};

export default memo(RelatedBooks);
