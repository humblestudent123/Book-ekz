import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../Reader/ReaderModal.css';

export default function ReaderModal({ book, pages, pageIndex, onClose, nextPage, prevPage, goToPage }) {
  const [inputPage, setInputPage] = useState(pageIndex + 1);
  const [quotes, setQuotes] = useState({});           // цитаты по книге
  const [showQuotesList, setShowQuotesList] = useState(false); // показывать overlay цитат
  const [selectionText, setSelectionText] = useState('');      // текущий выделенный текст
  const [showAddBtn, setShowAddBtn] = useState(false);         // кнопка добавить цитату
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });       // позиция кнопки

  // Обновляем input при смене страницы
  useEffect(() => {
    setInputPage(pageIndex + 1);
  }, [pageIndex]);

  // Отслеживаем выделение текста
// Следим за выделением текста
const handleMouseUp = () => {
  const selection = window.getSelection().toString().trim();
  if (selection) {
    setSelectionText(selection);
    setShowAddBtn(true);

    // получаем позицию выделенного текста
    const rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
    setBtnPos({ 
      x: rect.left + window.scrollX, 
      y: rect.top + window.scrollY - 30 // чуть выше текста
    });
  } else {
    setShowAddBtn(false);
  }
};

// Добавление цитаты
const handleAddQuote = () => {
  if (selectionText) {
    setQuotes(prev => ({
      ...prev,
      [book.id]: [...(prev[book.id] || []), selectionText]
    }));
    setShowAddBtn(false);
    window.getSelection().removeAllRanges(); // убираем выделение
  }
};
// Удаление цитаты
const handleDeleteQuote = (index) => {
  setQuotes(prev => ({
    ...prev,
    [book.id]: prev[book.id].filter((_, i) => i !== index)
  }));
};




  const handleInputChange = (e) => setInputPage(e.target.value);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const pageNum = Number(inputPage);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= pages.length) {
        goToPage(pageNum - 1);
      }
    }
  };

  return (
    <div className="reader-overlay" onClick={onClose}>
      <div
        className="reader-modal black-theme"
        onClick={(e) => e.stopPropagation()}
        onMouseUp={handleMouseUp}
        role="dialog"
        aria-modal="true"
      >
        {/* Кнопка закрытия */}
        <button className="reader-close" onClick={onClose}>✕</button>

        {/* Заголовок книги + кнопка показать цитаты */}
        <div className="reader-header">
          <strong>{book.title}</strong>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ opacity: 0.8, fontSize: 13 }}>
              {book.author} · {book.year}
            </div>
            <button
              onClick={() => setShowQuotesList(prev => !prev)}
              style={{
                padding: '7px 6px',
                fontSize: 12,
                borderRadius: 11,
                border: '1px solid #555',
                background: '#222',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              {showQuotesList ? 'Скрыть цитаты' : 'Показать цитаты'}
            </button>
          </div>
        </div>

        {/* Контент книги */}
        <div className="reader-content">
          {pages.length > 0 ? (
            <div className="reader-page">{pages[pageIndex]}</div>
          ) : (
            <div className="reader-page">Нет содержания для чтения.</div>
          )}
        </div>

        {/* Контролы навигации */}
        <div className="reader-controls">
          <button onClick={prevPage} disabled={pageIndex === 0}>←</button>
          <div className="reader-progress">
            Стр.
            <input
              type="number"
              min="1"
              max={pages.length}
              value={inputPage}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              style={{
                width: 50,
                margin: '0 5px',
                background: '#000',
                color: '#fff',
                border: '1px solid #555',
                borderRadius: 4,
              }}
            />
            / {pages.length}
          </div>
          <button onClick={nextPage} disabled={pageIndex >= pages.length - 1}>→</button>
        </div>

        {/* Overlay с цитатами */}
        {showQuotesList && (
          <div
            className="quotes-list-overlay"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              zIndex: 1300,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onClick={() => setShowQuotesList(false)}
          >
            <div
              className="quotes-list"
              style={{
                background: '#111',
                padding: 20,
                borderRadius: 12,
                maxWidth: '400px',
                maxHeight: '70vh',
                overflowY: 'auto',
                color: '#fff',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Цитаты</h3>
{quotes[book.id]?.length ? (
  quotes[book.id].map((q, idx) => (
    <div
      key={idx}
      style={{
        padding: '8px',
        borderBottom: '1px solid #333',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10
      }}
    >
      <span style={{ fontSize: 14 }}>{q}</span>

      <button
        onClick={() => handleDeleteQuote(idx)}
        style={{
          background: 'transparent',
          border: '1px solid #555',
          color: '#ff6b6b',
          borderRadius: 4,
          padding: '2px 6px',
          cursor: 'pointer',
          fontSize: 12
        }}
      >
        ✕
      </button>
    </div>
  ))
) : (
  <p>Нет цитат</p>
)}
            </div>
          </div>
        )}

        {/* Кнопка добавить цитату рядом с выделением */}
        {showAddBtn && (
          <button
            onClick={handleAddQuote}
            style={{
              position: 'absolute',
              left: btnPos.x + 5,
              top: btnPos.y - 25,
              zIndex: 1400,
              padding: '4px 8px',
              background: '#4caf50',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Добавить цитату
          </button>
        )}
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
  goToPage: PropTypes.func.isRequired,
};