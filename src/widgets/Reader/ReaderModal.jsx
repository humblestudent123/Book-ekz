import React from 'react';
import PropTypes from 'prop-types';

export default function ReaderModal({
  book, pages, pageIndex, onClose, nextPage, prevPage
}) {
  return (
    <div className="reader-overlay" onClick={onClose}>
      <div
        className={`reader-modal black-theme`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button className="reader-close" onClick={onClose} aria-label="Закрыть">✕</button>

        <div className="reader-header">
          <strong>{book.title}</strong>
          <div style={{ opacity: 0.8, fontSize: 13 }}>{book.author} · {book.year}</div>
        </div>

        <div className="reader-content">
          {pages.length > 0 ? (
            <div className="reader-page">{pages[pageIndex]}</div>
          ) : (
            <div className="reader-page">Нет содержания для чтения.</div>
          )}
        </div>

        <div className="reader-controls">
          <button onClick={prevPage} disabled={pageIndex === 0}>← Предыдущая</button>
          <div className="reader-progress">Стр. {pageIndex + 1} / {pages.length}</div>
          <button onClick={nextPage} disabled={pageIndex >= pages.length - 1}>Следующая →</button>
        </div>
      </div>
    </div>
  );
}

ReaderModal.propTypes = {
  book: PropTypes.object.isRequired,
  pages: PropTypes.array.isRequired,
  pageIndex: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  nextPage: PropTypes.func.isRequired,
  prevPage: PropTypes.func.isRequired,
};