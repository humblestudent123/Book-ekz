export default function BookPreviewModal({ book, onClose, onRead }) {
  if (!book) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="preview-modal" onClick={(e) => e.stopPropagation()}>

        <div className="preview-left">
          <img src={book.cover} alt={book.title} />
        </div>

        <div className="preview-right">
          <h2>{book.title}</h2>
          <p className="author">{book.author}</p>

          <p className="desc">
            {book.description || "Описание книги недоступно"}
          </p>

          <button className="read-btn" onClick={() => onRead(book)}>
            Читать
          </button>

          <button className="close-btn" onClick={onClose}>
            Закрыть
          </button>
        </div>

      </div>
    </div>
  );
}