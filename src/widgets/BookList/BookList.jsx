import PropTypes from 'prop-types';
import BookCard from '../../entities/book/BookCard';

export default function BookList({
  title,
  description,
  books,
  onSelect = () => {},
  action,
  emptyMessage = 'Пока нет книг в этом разделе.'
})  {
  return (
    <section className="shelf-section">
      <div className="shelf-section__header">
        <div>
          <h2>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
        {action ? <div className="shelf-section__action">{action}</div> : null}
      </div>

      {books.length ? (
        <div className="books-grid">
          {books.map((book) => (
            <BookCard key={book.id} book={book} onSelect={() => onSelect(book)} />
          ))}
        </div>
      ) : (
        <div className="empty-state">{emptyMessage}</div>
      )}
    </section>
  );
}

BookList.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  books: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelect: PropTypes.func, // ❌ убрали isRequired
  action: PropTypes.node,
  emptyMessage: PropTypes.string
};