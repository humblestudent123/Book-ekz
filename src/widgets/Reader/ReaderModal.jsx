import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import '../Reader/ReaderModal.css';

export default function ReaderModal({ book, pages, pageIndex, onClose, nextPage, prevPage, goToPage }) {
  const [inputPage, setInputPage] = useState(pageIndex + 1);
  const [showQuotesList, setShowQuotesList] = useState(false); // показывать overlay цитат
  const [selectionText, setSelectionText] = useState('');      // текущий выделенный текст
  const [showAddBtn, setShowAddBtn] = useState(false);         // кнопка добавить цитату
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });       // позиция кнопки
  const modalRef = useRef(null);
  const [quotes, setQuotes] = useState(() => {
  const saved = localStorage.getItem('quotes');
  return saved ? JSON.parse(saved) : {};
  }); // цитаты по книге



  // автосохранение при изменении
  useEffect(() => {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }, [quotes]);

  // Обновляем input при смене страницы
  useEffect(() => {
    setInputPage(pageIndex + 1);
  }, [pageIndex]);

  useEffect(() => {
  const handleSelectionChange = () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();

    if (!text) {
      setShowAddBtn(false);
    }
  };

  document.addEventListener('selectionchange', handleSelectionChange);

  return () => {
    document.removeEventListener('selectionchange', handleSelectionChange);
  };
}, []);


  // Отслеживаем выделение текста
// Следим за выделением текста
const handleMouseUp = () => {
  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0) {
    setShowAddBtn(false);
    return;
  }

  const text = selection.toString().trim();

  if (!text) {
    setShowAddBtn(false);
    return;
  }

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  const modalRect = modalRef.current.getBoundingClientRect();

  setSelectionText(text);
  setShowAddBtn(true);

  setBtnPos({
    x: Math.min(rect.right - modalRect.left + 5, modalRect.width - 40),
    y: Math.max(rect.bottom - modalRect.top + 5, 10)
  });
  };


// Добавление цитаты + отображение даты и времени
const now = new Date();
const formatted = `${now.getDate().toString().padStart(2,'0')}.${(now.getMonth()+1).toString().padStart(2,'0')}.${now.getFullYear()} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
const handleAddQuote = () => {
  if (selectionText) {
    setQuotes(prev => ({
      ...prev,
      [book.id]: [
        ...(prev[book.id] || []),
        {
          text: selectionText,
          date: formatted
        }
      ]
    }));

    setShowAddBtn(false);
    window.getSelection().removeAllRanges();
  }
};
// Удаление цитаты
const handleDeleteQuote = (index) => {
  setQuotes(prev => ({
    ...prev,
    [book.id]: prev[book.id].filter((_, i) => i !== index)
  }));
};
// Удаление всех цитат
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
        ref={modalRef}
        className="reader-modal black-theme"
        onClick={(e) => e.stopPropagation()}
        onMouseUp={handleMouseUp}
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
        marginBottom: 6,
      }}
    >
      {/* Дата над цитатой */}
      {typeof q !== 'string' && q.date && (
        <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 4 }}>
          {q.date}
        </div>
      )}

      {/* Сам текст цитаты */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 14 }}>
          {typeof q === 'string' ? q : q.text}
        </span>

        {/* Кнопка удалить */}
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
        left: btnPos.x,
        top: btnPos.y,
        zIndex: 1400,
        padding: '4px 8px',
        background: '#ffffffff',
        color: '#000000ff',
        border: 'none',
        borderRadius: 4,
        cursor: 'pointer',
        fontSize: 12,
        whiteSpace: 'nowrap'
      }}
    >
      +
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
